import { formatSubmodulePushFailureDetail } from '../../../shared/git-remote-error'
import {
  isPushHookFailure,
  summarizePushFailure
} from '../../../shared/source-control-push-failure'
import {
  fixedRemoteOperationErrorMessage,
  formatRemoteOperationAccessFailure,
  formatRemoteOperationConnectionFailure,
  formatRemoteOperationFailure,
  formatRemoteOperationHookBlocked,
  formatRemoteOperationLocalChangesBlocked,
  formatRemoteOperationUntrackedFilesBlocked,
  type RemoteOperationKind
} from './source-control-remote-error-copy'
import {
  extractPublishFailureDetail,
  resolveRemoteOperationDetail,
  truncateRemoteOperationDetail
} from './source-control-remote-error-detail'

const SYNC_PUSH_STAGE_ERROR = Symbol('source-control-sync-push-stage-error')
type SyncPushStageMarkedError = Error & { [SYNC_PUSH_STAGE_ERROR]?: true }

function resolveSubmodulePushFailureMessage(
  message: string,
  operation: RemoteOperationKind
): string | null {
  const detail = formatSubmodulePushFailureDetail(message)
  return detail
    ? formatRemoteOperationFailure(operation, truncateRemoteOperationDetail(detail))
    : null
}

function isNonFastForwardRemoteError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }
  return (
    /non-fast-forward|fetch first|updates were rejected|stale info/i.test(error.message) ||
    formatSubmodulePushFailureDetail(error.message)?.includes('has remote changes') === true
  )
}

export type RemoteOperationErrorOptions = {
  publish?: boolean
  isPush?: boolean
  isForcePush?: boolean
  isSync?: boolean
  isSyncPushStage?: boolean
  isFetch?: boolean
  isFastForward?: boolean
  isRebase?: boolean
}

export function markSyncPushStageError<T>(error: T): T {
  if (error instanceof Error) {
    Object.defineProperty(error, SYNC_PUSH_STAGE_ERROR, {
      configurable: true,
      value: true
    })
  }
  return error
}

export function isSyncPushStageError(error: unknown): boolean {
  return (
    error instanceof Error && (error as SyncPushStageMarkedError)[SYNC_PUSH_STAGE_ERROR] === true
  )
}

// Why: shared patterns so unconcluded-merge vs fresh-conflict toast copy cannot
// drift between the two branches below.
const UNCONCLUDED_MERGE_ERROR_PATTERN =
  /unmerged files|needs merge|you have not concluded your merge/i
const FRESH_MERGE_CONFLICT_ERROR_PATTERN = /automatic merge failed|CONFLICT \(|fix conflicts/i

export function resolveRemoteOperationErrorMessage(
  error: unknown,
  options?: RemoteOperationErrorOptions
): string {
  if (!(error instanceof Error)) {
    return fixedRemoteOperationErrorMessage('generic')
  }

  if (UNCONCLUDED_MERGE_ERROR_PATTERN.test(error.message)) {
    if (options?.isRebase) {
      return fixedRemoteOperationErrorMessage('rebaseExistingConflicts')
    }
    return options?.isSync
      ? fixedRemoteOperationErrorMessage('syncExistingConflicts')
      : fixedRemoteOperationErrorMessage('pullExistingConflicts')
  }

  if (FRESH_MERGE_CONFLICT_ERROR_PATTERN.test(error.message)) {
    if (options?.isRebase) {
      return fixedRemoteOperationErrorMessage('rebaseNewConflicts')
    }
    return options?.isSync
      ? fixedRemoteOperationErrorMessage('syncNewConflicts')
      : fixedRemoteOperationErrorMessage('pullNewConflicts')
  }

  if (options?.publish) {
    const submoduleMessage = resolveSubmodulePushFailureMessage(error.message, 'publish')
    if (submoduleMessage) {
      return submoduleMessage
    }
  }

  if (options?.isSync) {
    const submoduleMessage = resolveSubmodulePushFailureMessage(error.message, 'sync')
    if (submoduleMessage) {
      return submoduleMessage
    }
  }

  if (options?.isForcePush) {
    const submoduleMessage = resolveSubmodulePushFailureMessage(error.message, 'forcePush')
    if (submoduleMessage) {
      return submoduleMessage
    }
  }

  if (options?.isPush) {
    const submoduleMessage = resolveSubmodulePushFailureMessage(error.message, 'push')
    if (submoduleMessage) {
      return submoduleMessage
    }
  }

  const isPushLikeOperation =
    options?.isPush || options?.isForcePush || options?.publish || options?.isSyncPushStage
  if (isPushLikeOperation && isPushHookFailure(error.message)) {
    const summary = summarizePushFailure(error.message)
    return formatRemoteOperationHookBlocked(
      options?.publish
        ? 'publish'
        : options?.isSyncPushStage
          ? 'sync'
          : options?.isForcePush
            ? 'forcePush'
            : 'push',
      `${summary.charAt(0).toLowerCase()}${summary.slice(1)}`
    )
  }

  // Why: under sync, the inner push runs *after* a successful pull, so a
  // non-fast-forward at that point means the remote raced ahead between
  // fetch and push — not "user forgot to pull". Saying "Pull first" would
  // be wrong (sync just did). Branch isSync above the shared NFF path so
  // sync gets a sync-shaped message instead of inheriting the push wording.
  if (
    options?.isSync &&
    /non-fast-forward|fetch first|updates were rejected/i.test(error.message)
  ) {
    return fixedRemoteOperationErrorMessage('syncRemoteMoved')
  }

  // Why: force-with-lease rejection means the remote moved since our last
  // snapshot; telling the user to pull would defeat the explicit force-push
  // path and can reintroduce commits they meant to replace.
  if (
    options?.isForcePush &&
    /non-fast-forward|fetch first|updates were rejected|stale info/i.test(error.message)
  ) {
    return fixedRemoteOperationErrorMessage('forcePushRemoteChanged')
  }

  // Why: non-fast-forward/rejected detection is shared across publish and push so
  // both paths surface the same actionable toast regardless of operation type.
  if (/non-fast-forward|fetch first|updates were rejected/i.test(error.message)) {
    return fixedRemoteOperationErrorMessage('pushRemoteChanged')
  }

  // Why: `git pull` / merge refuses to run when the working tree has changes
  // that would be overwritten; surface a single readable line instead of the
  // multi-line git stderr (which lists every affected path).
  if (
    /local changes.*would be overwritten|Please commit your changes or stash them/i.test(
      error.message
    )
  ) {
    if (options?.isRebase) {
      return formatRemoteOperationLocalChangesBlocked('rebase')
    }
    if (options?.isFastForward) {
      return formatRemoteOperationLocalChangesBlocked('fastForward')
    }
    return fixedRemoteOperationErrorMessage('pullLocalChangesBlocked')
  }

  if (/Pull would overwrite local changes/i.test(error.message)) {
    if (options?.isRebase) {
      return formatRemoteOperationLocalChangesBlocked('rebase')
    }
    if (options?.isFastForward) {
      return formatRemoteOperationLocalChangesBlocked('fastForward')
    }
    return fixedRemoteOperationErrorMessage('pullLocalChangesBlocked')
  }

  if (/Pull would overwrite untracked files/i.test(error.message)) {
    if (options?.isRebase) {
      return formatRemoteOperationUntrackedFilesBlocked('rebase')
    }
    if (options?.isFastForward) {
      return formatRemoteOperationUntrackedFilesBlocked('fastForward')
    }
    return fixedRemoteOperationErrorMessage('pullUntrackedFilesBlocked')
  }

  if (options?.publish) {
    // Why: publish failures often bubble up as raw wrapped git/IPC payloads; this
    // keeps the toast human-readable while preserving the actionable fatal reason.
    const detail = extractPublishFailureDetail(error.message)
    return formatRemoteOperationAccessFailure('publish', detail ?? undefined)
  }

  if (options?.isSync) {
    // Why: the user invoked Sync — surface "Sync failed" rather than leaking
    // the inner-step name ("Push failed"). Detail extraction matches push so
    // auth / protected-branch reasons stay actionable.
    const detail = extractPublishFailureDetail(error.message)
    if (detail) {
      return formatRemoteOperationAccessFailure('sync', detail)
    }
    return formatRemoteOperationConnectionFailure('sync')
  }

  if (options?.isForcePush) {
    const detail = extractPublishFailureDetail(error.message)
    if (detail) {
      return formatRemoteOperationAccessFailure('forcePush', detail)
    }
    return formatRemoteOperationConnectionFailure('forcePush')
  }

  if (options?.isPush) {
    // Why: surfacing fatal/remote lines from git is more actionable than a generic
    // connection message for auth errors, protected branches, etc.
    const detail = extractPublishFailureDetail(error.message)
    if (detail) {
      return formatRemoteOperationAccessFailure('push', detail)
    }
    return formatRemoteOperationConnectionFailure('push')
  }

  if (options?.isFetch) {
    return formatRemoteOperationFailure('fetch', resolveRemoteOperationDetail(error.message))
  }

  if (options?.isFastForward) {
    return formatRemoteOperationFailure('fastForward', resolveRemoteOperationDetail(error.message))
  }

  if (options?.isRebase) {
    return formatRemoteOperationFailure('rebase', resolveRemoteOperationDetail(error.message))
  }

  return error.message
}

export { isNonFastForwardRemoteError }
