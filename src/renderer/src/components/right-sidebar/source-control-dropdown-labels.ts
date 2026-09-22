// Why: label/title wording for the dropdown rows, kept apart from the priority ladder so copy edits
// do not touch the state machine.

import { translate } from '@/i18n/i18n'

export function describePushCount(ahead: number): string {
  return translate(
    ahead === 1
      ? 'auto.components.rightSidebar.sourceControl.pushCount.one'
      : 'auto.components.rightSidebar.sourceControl.pushCount.other',
    ahead === 1 ? 'Push {{count}} commit' : 'Push {{count}} commits',
    { count: ahead }
  )
}

export function describePullCount(behind: number): string {
  return translate(
    behind === 1
      ? 'auto.components.rightSidebar.sourceControl.pullCount.one'
      : 'auto.components.rightSidebar.sourceControl.pullCount.other',
    behind === 1 ? 'Pull {{count}} commit' : 'Pull {{count}} commits',
    { count: behind }
  )
}

export function describeFastForwardCount(behind: number): string {
  return translate(
    behind === 1
      ? 'auto.components.rightSidebar.sourceControl.fastForwardCount.one'
      : 'auto.components.rightSidebar.sourceControl.fastForwardCount.other',
    behind === 1 ? 'Fast-forward {{count}} commit' : 'Fast-forward {{count}} commits',
    { count: behind }
  )
}

export function describeSyncCounts(ahead: number, behind: number): string {
  return translate(
    'auto.components.rightSidebar.sourceControl.syncCounts',
    'Pull {{behind}}, push {{ahead}}',
    { ahead, behind }
  )
}

export function formatCountLabel(base: string, count: number): string {
  return count > 0 ? `${base} (${count})` : base
}

export function formatSyncLabel(base: string, ahead: number, behind: number): string {
  if (ahead === 0 && behind === 0) {
    return base
  }
  return `${base} (↓${behind} ↑${ahead})`
}

export function formatForcePushTitle(
  branchCommitsAhead: number | undefined,
  upstreamName?: string
): string {
  const countText = branchCommitsAhead
    ? translate(
        branchCommitsAhead === 1
          ? 'auto.components.rightSidebar.sourceControl.branchCommit.one'
          : 'auto.components.rightSidebar.sourceControl.branchCommit.other',
        branchCommitsAhead === 1 ? '{{count}} branch commit' : '{{count}} branch commits',
        { count: branchCommitsAhead }
      )
    : translate('auto.components.rightSidebar.sourceControl.thisBranch', 'this branch')
  const remoteTarget =
    upstreamName ??
    translate('auto.components.rightSidebar.sourceControl.theRemoteBranch', 'the remote branch')
  return translate(
    'auto.components.rightSidebar.sourceControl.forcePushOlderRemote',
    'Remote only has older copies of local commits. Force push {{countText}} with lease to update {{remoteTarget}}.',
    { countText, remoteTarget }
  )
}

export function formatManualForcePushTitle(
  ahead: number,
  behind: number,
  upstreamName?: string
): string {
  const commitText = translate(
    ahead === 1
      ? 'auto.components.rightSidebar.sourceControl.localCommit.one'
      : 'auto.components.rightSidebar.sourceControl.localCommit.other',
    ahead === 1 ? '{{count}} local commit' : '{{count}} local commits',
    { count: ahead }
  )
  const remoteTarget =
    upstreamName ??
    translate('auto.components.rightSidebar.sourceControl.theRemoteBranch', 'the remote branch')
  if (behind > 0) {
    return translate(
      'auto.components.rightSidebar.sourceControl.forcePushReplaceRemote',
      'Force push {{commitText}} with lease to update {{remoteTarget}} and replace remote-only commits.',
      { commitText, remoteTarget }
    )
  }
  return translate(
    'auto.components.rightSidebar.sourceControl.forcePushUpdateRemote',
    'Force push {{commitText}} with lease to update {{remoteTarget}}.',
    { commitText, remoteTarget }
  )
}

export function formatUnpublishedForcePushTitle(branchCommitsAhead: number | undefined): string {
  const countText = branchCommitsAhead
    ? translate(
        branchCommitsAhead === 1
          ? 'auto.components.rightSidebar.sourceControl.branchCommit.one'
          : 'auto.components.rightSidebar.sourceControl.branchCommit.other',
        branchCommitsAhead === 1 ? '{{count}} branch commit' : '{{count}} branch commits',
        { count: branchCommitsAhead }
      )
    : translate('auto.components.rightSidebar.sourceControl.thisBranch', 'this branch')
  return translate(
    'auto.components.rightSidebar.sourceControl.forcePushSetUpstream',
    'Force push {{countText}} with lease and set an upstream if needed.',
    { countText }
  )
}

export function formatRebaseBaseRef(baseRef: string): string {
  return baseRef.replace(/^refs\/remotes\//, '').replace(/^remotes\//, '')
}
