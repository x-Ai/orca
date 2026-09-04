import { translate } from '@/i18n/i18n'

export type RemoteOperationKind =
  | 'publish'
  | 'sync'
  | 'forcePush'
  | 'push'
  | 'fetch'
  | 'fastForward'
  | 'rebase'

export type FixedRemoteOperationError =
  | 'generic'
  | 'rebaseExistingConflicts'
  | 'syncExistingConflicts'
  | 'pullExistingConflicts'
  | 'rebaseNewConflicts'
  | 'syncNewConflicts'
  | 'pullNewConflicts'
  | 'syncRemoteMoved'
  | 'forcePushRemoteChanged'
  | 'pushRemoteChanged'
  | 'pullLocalChangesBlocked'
  | 'pullUntrackedFilesBlocked'

export function remoteOperationLabel(kind: RemoteOperationKind): string {
  switch (kind) {
    case 'publish':
      return translate('sourceControl.remoteErrors.labels.publish', 'Publish Branch')
    case 'sync':
      return translate('sourceControl.remoteErrors.labels.sync', 'Sync')
    case 'forcePush':
      return translate('sourceControl.remoteErrors.labels.forcePush', 'Force Push')
    case 'push':
      return translate('sourceControl.remoteErrors.labels.push', 'Push')
    case 'fetch':
      return translate('sourceControl.remoteErrors.labels.fetch', 'Fetch')
    case 'fastForward':
      return translate('sourceControl.remoteErrors.labels.fastForward', 'Fast-forward')
    case 'rebase':
      return translate('sourceControl.remoteErrors.labels.rebase', 'Rebase')
  }
}

export function fixedRemoteOperationErrorMessage(kind: FixedRemoteOperationError): string {
  switch (kind) {
    case 'generic':
      return translate('sourceControl.remoteErrors.generic', 'Remote operation failed')
    case 'rebaseExistingConflicts':
      return translate(
        'sourceControl.remoteErrors.rebaseExistingConflicts',
        'Rebase blocked — resolve existing conflicts first.'
      )
    case 'syncExistingConflicts':
      return translate(
        'sourceControl.remoteErrors.syncExistingConflicts',
        'Sync blocked — resolve existing merge conflicts first.'
      )
    case 'pullExistingConflicts':
      return translate(
        'sourceControl.remoteErrors.pullExistingConflicts',
        'Pull blocked — resolve existing merge conflicts first.'
      )
    case 'rebaseNewConflicts':
      return translate(
        'sourceControl.remoteErrors.rebaseNewConflicts',
        'Rebase stopped with conflicts. Resolve them in Source Control, then continue the rebase.'
      )
    case 'syncNewConflicts':
      return translate(
        'sourceControl.remoteErrors.syncNewConflicts',
        'Sync stopped with merge conflicts. Resolve them in Source Control, then commit the merge.'
      )
    case 'pullNewConflicts':
      return translate(
        'sourceControl.remoteErrors.pullNewConflicts',
        'Pull stopped with merge conflicts. Resolve them in Source Control, then commit the merge.'
      )
    case 'syncRemoteMoved':
      return translate(
        'sourceControl.remoteErrors.syncRemoteMoved',
        'Sync failed — remote moved while syncing. Try again.'
      )
    case 'forcePushRemoteChanged':
      return translate(
        'sourceControl.remoteErrors.forcePushRemoteChanged',
        'Force push rejected — remote changed since last fetch. Fetch first, then try again.'
      )
    case 'pushRemoteChanged':
      return translate(
        'sourceControl.remoteErrors.pushRemoteChanged',
        'Push rejected — remote has changes. Pull first, then try again.'
      )
    case 'pullLocalChangesBlocked':
      return translate(
        'sourceControl.remoteErrors.pullLocalChangesBlocked',
        'Pull blocked — commit or stash your local changes first.'
      )
    case 'pullUntrackedFilesBlocked':
      return translate(
        'sourceControl.remoteErrors.pullUntrackedFilesBlocked',
        'Pull blocked — move, remove, or add untracked files first.'
      )
  }
}

export function formatRemoteOperationFailure(
  operation: RemoteOperationKind,
  detail: string
): string {
  return translate(
    'sourceControl.remoteErrors.operationFailedWithDetail',
    '{{operation}} failed. {{detail}}',
    { operation: remoteOperationLabel(operation), detail }
  )
}

export function formatRemoteOperationHookBlocked(
  operation: RemoteOperationKind,
  detail: string
): string {
  return translate('sourceControl.remoteErrors.hookBlocked', '{{operation}} blocked — {{detail}}', {
    operation: remoteOperationLabel(operation),
    detail
  })
}

export function formatRemoteOperationLocalChangesBlocked(operation: RemoteOperationKind): string {
  return translate(
    'sourceControl.remoteErrors.localChangesBlocked',
    '{{operation}} blocked — commit or stash your local changes first.',
    { operation: remoteOperationLabel(operation) }
  )
}

export function formatRemoteOperationUntrackedFilesBlocked(operation: RemoteOperationKind): string {
  return translate(
    'sourceControl.remoteErrors.untrackedFilesBlocked',
    '{{operation}} blocked — move, remove, or add untracked files first.',
    { operation: remoteOperationLabel(operation) }
  )
}

export function formatRemoteOperationAccessFailure(
  operation: RemoteOperationKind,
  detail?: string
): string {
  return detail
    ? translate(
        'sourceControl.remoteErrors.failedWithRemoteAccessDetail',
        '{{operation}} failed. {{detail}}. Check your remote access and try again.',
        { operation: remoteOperationLabel(operation), detail }
      )
    : translate(
        'sourceControl.remoteErrors.failedRemoteAccess',
        '{{operation}} failed. Check your remote access and try again.',
        { operation: remoteOperationLabel(operation) }
      )
}

export function formatRemoteOperationConnectionFailure(operation: RemoteOperationKind): string {
  return translate(
    'sourceControl.remoteErrors.failedConnection',
    '{{operation}} failed. Check your connection and try again.',
    { operation: remoteOperationLabel(operation) }
  )
}
