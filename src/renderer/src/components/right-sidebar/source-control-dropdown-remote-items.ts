// Why: the rows that move commits between local and remote. They share the ahead/behind counts and
// the force-with-lease verdict, so a change to one ladder is reviewable against its siblings.

import { translate } from '@/i18n/i18n'
import type { DropdownItem } from './source-control-dropdown-item-types'
import type { DropdownActionContext } from './source-control-dropdown-action-context'
import {
  describeFastForwardCount,
  describePullCount,
  describePushCount,
  describeSyncCounts,
  formatCountLabel,
  formatManualForcePushTitle,
  formatRebaseBaseRef,
  formatSyncLabel,
  formatUnpublishedForcePushTitle
} from './source-control-dropdown-labels'
import {
  branchAlreadyPublishedTitle,
  branchUpToDateTitle,
  checkingBranchStatusTitle,
  checkingPrStatusTitle,
  checkoutBeforeFastForwardTitle,
  checkoutBeforeForcePushTitle,
  checkoutBeforePublishTitle,
  checkoutBeforePullTitle,
  checkoutBeforePushTitle,
  checkoutBeforeSyncTitle,
  chooseRemoteBaseToRebaseTitle,
  linkedReviewTargetUnavailableTitle,
  nothingNewToFastForwardOlderRemoteTitle,
  nothingNewToPullOlderRemoteTitle,
  nothingToFastForwardTitle,
  nothingToForcePushTitle,
  nothingToPullTitle,
  nothingToPushTitle,
  prAlreadyMergedTitle,
  preferForcePushOlderRemoteTitle,
  publishFirstToFastForwardTitle,
  publishFirstToPullTitle,
  publishFirstToSyncTitle,
  pushLinkedReviewUpdatesTitle,
  pushMayRequireSyncTitle,
  pushSetUpstreamTitle,
  rebaseCurrentFromBaseTitle,
  tryFastForwardMayRejectTitle,
  tryRebasingDirtyTitle,
  tryRegularPushMayForceTitle
} from './source-control-dropdown-status-titles'
import {
  linkedReviewBranchExistsTitle,
  publishBranchToOriginTitle
} from './source-control-dropdown-review-status-titles'

export type RemoteDropdownItems = {
  push: DropdownItem
  forcePush: DropdownItem
  pull: DropdownItem
  fastForward: DropdownItem
  sync: DropdownItem
  rebase: DropdownItem
  fetch: DropdownItem
  publish: DropdownItem
}

export function buildRemoteDropdownItems(ctx: DropdownActionContext): RemoteDropdownItems {
  const {
    upstreamStatus,
    branchCommitsAhead,
    canPushLinkedReviewWithoutUpstream,
    rebaseBaseRef,
    hasDirtyLocalChanges,
    globalBusy,
    upstreamLoading,
    hasUpstream,
    canPushUntrackedHostedReview,
    pushBlockedByOpenHostedReviewTarget,
    publishBlockedByMergedPR,
    publishBlockedByPRLoading,
    publishBlockedByOpenHostedReview,
    publishBlockedByDetachedHead,
    ahead,
    behind,
    shouldForcePushWithLease,
    pushLabelCount,
    forcePushTitle
  } = ctx

  const push: DropdownItem = {
    kind: 'push',
    label: formatCountLabel(
      translate('auto.components.right.sidebar.source.control.dropdown.remote.items.push', 'Push'),
      ahead
    ),
    title: publishBlockedByDetachedHead
      ? checkoutBeforePushTitle()
      : pushBlockedByOpenHostedReviewTarget
        ? linkedReviewTargetUnavailableTitle()
        : upstreamLoading
          ? pushSetUpstreamTitle()
          : canPushUntrackedHostedReview
            ? pushLinkedReviewUpdatesTitle()
            : !hasUpstream
              ? pushSetUpstreamTitle()
              : shouldForcePushWithLease
                ? tryRegularPushMayForceTitle()
                : behind > 0 && ahead > 0
                  ? pushMayRequireSyncTitle()
                  : ahead === 0
                    ? nothingToPushTitle(upstreamStatus?.upstreamName)
                    : describePushCount(ahead),
    // Why: Push stays available without an upstream (git resolves --set-upstream) and under force-with-lease; only detached HEAD and unknown review targets block.
    disabled: globalBusy || publishBlockedByDetachedHead || pushBlockedByOpenHostedReviewTarget
  }

  const forcePush: DropdownItem = {
    kind: 'force_push',
    label: formatCountLabel(
      translate(
        'auto.components.right.sidebar.source.control.dropdown.remote.items.forcepush',
        'Force Push'
      ),
      pushLabelCount
    ),
    title: publishBlockedByDetachedHead
      ? checkoutBeforeForcePushTitle()
      : pushBlockedByOpenHostedReviewTarget
        ? linkedReviewTargetUnavailableTitle()
        : upstreamLoading
          ? formatUnpublishedForcePushTitle(branchCommitsAhead)
          : !hasUpstream
            ? formatUnpublishedForcePushTitle(branchCommitsAhead)
            : pushLabelCount === 0
              ? nothingToForcePushTitle(upstreamStatus?.upstreamName)
              : shouldForcePushWithLease
                ? forcePushTitle
                : formatManualForcePushTitle(pushLabelCount, behind, upstreamStatus?.upstreamName),
    // Why: same target-safety gate as Push — force-with-lease to a wrong review head is worse than blocking; stays available without an upstream.
    disabled: globalBusy || publishBlockedByDetachedHead || pushBlockedByOpenHostedReviewTarget
  }

  const pull: DropdownItem = {
    kind: 'pull',
    label: formatCountLabel(
      translate('auto.components.right.sidebar.source.control.dropdown.remote.items.pull', 'Pull'),
      behind
    ),
    title: upstreamLoading
      ? checkingBranchStatusTitle()
      : publishBlockedByPRLoading
        ? checkingPrStatusTitle()
        : publishBlockedByMergedPR
          ? prAlreadyMergedTitle()
          : publishBlockedByDetachedHead
            ? checkoutBeforePullTitle()
            : !hasUpstream
              ? publishFirstToPullTitle()
              : shouldForcePushWithLease
                ? nothingNewToPullOlderRemoteTitle()
                : behind === 0
                  ? nothingToPullTitle()
                  : describePullCount(behind),
    disabled: globalBusy || upstreamLoading || !hasUpstream || publishBlockedByDetachedHead
  }

  const fastForward: DropdownItem = {
    kind: 'fast_forward',
    label: formatCountLabel(
      translate(
        'auto.components.right.sidebar.source.control.dropdown.remote.items.fastforward',
        'Fast-forward'
      ),
      behind
    ),
    title: upstreamLoading
      ? checkingBranchStatusTitle()
      : publishBlockedByPRLoading
        ? checkingPrStatusTitle()
        : publishBlockedByMergedPR
          ? prAlreadyMergedTitle()
          : publishBlockedByDetachedHead
            ? checkoutBeforeFastForwardTitle()
            : !hasUpstream
              ? publishFirstToFastForwardTitle()
              : shouldForcePushWithLease
                ? nothingNewToFastForwardOlderRemoteTitle()
                : behind === 0
                  ? nothingToFastForwardTitle()
                  : ahead > 0
                    ? tryFastForwardMayRejectTitle()
                    : describeFastForwardCount(behind),
    disabled: globalBusy || upstreamLoading || !hasUpstream || publishBlockedByDetachedHead
  }

  const sync: DropdownItem = {
    kind: 'sync',
    label: formatSyncLabel(
      translate('auto.components.right.sidebar.source.control.dropdown.remote.items.sync', 'Sync'),
      ahead,
      behind
    ),
    title: upstreamLoading
      ? checkingBranchStatusTitle()
      : publishBlockedByPRLoading
        ? checkingPrStatusTitle()
        : publishBlockedByMergedPR
          ? prAlreadyMergedTitle()
          : publishBlockedByDetachedHead
            ? checkoutBeforeSyncTitle()
            : !hasUpstream
              ? publishFirstToSyncTitle()
              : shouldForcePushWithLease
                ? preferForcePushOlderRemoteTitle()
                : ahead === 0 && behind === 0
                  ? branchUpToDateTitle()
                  : describeSyncCounts(ahead, behind),
    disabled:
      globalBusy ||
      upstreamLoading ||
      !hasUpstream ||
      publishBlockedByDetachedHead ||
      shouldForcePushWithLease
  }

  const rebaseBaseLabel = rebaseBaseRef ? formatRebaseBaseRef(rebaseBaseRef) : null
  const hasRemoteBaseRef = rebaseBaseLabel?.includes('/') === true
  const rebase: DropdownItem = {
    kind: 'rebase_base',
    label: rebaseBaseLabel
      ? translate(
          'auto.components.right.sidebar.source.control.dropdown.remote.items.rebase.from',
          'Rebase from {{ref}}',
          { ref: rebaseBaseLabel }
        )
      : translate(
          'auto.components.right.sidebar.source.control.dropdown.remote.items.rebase.base',
          'Rebase from Base'
        ),
    title: ((): string => {
      if (!rebaseBaseLabel || !hasRemoteBaseRef) {
        return chooseRemoteBaseToRebaseTitle()
      }
      if (hasDirtyLocalChanges) {
        return tryRebasingDirtyTitle()
      }
      return rebaseCurrentFromBaseTitle(rebaseBaseLabel)
    })(),
    disabled: globalBusy || !rebaseBaseRef || !hasRemoteBaseRef
  }

  const fetch: DropdownItem = {
    kind: 'fetch',
    label: translate(
      'auto.components.right.sidebar.source.control.dropdown.items.226b85a3a7',
      'Fetch'
    ),
    title: translate(
      'auto.components.right.sidebar.source.control.dropdown.items.04d709801d',
      'Fetch from remote without merging'
    ),
    disabled: globalBusy
  }

  const publish: DropdownItem = {
    kind: 'publish',
    label:
      publishBlockedByMergedPR || publishBlockedByPRLoading
        ? translate(
            'auto.components.right.sidebar.source.control.dropdown.remote.items.publish.prstatus',
            'PR Status'
          )
        : publishBlockedByOpenHostedReview
          ? translate(
              'auto.components.right.sidebar.source.control.dropdown.remote.items.publish.linkedreview',
              'Linked Review'
            )
          : publishBlockedByDetachedHead
            ? translate(
                'auto.components.right.sidebar.source.control.dropdown.remote.items.publish.nobranch',
                'No Branch'
              )
            : translate(
                'auto.components.right.sidebar.source.control.dropdown.remote.items.publish.branch',
                'Publish Branch'
              ),
    title: upstreamLoading
      ? checkingBranchStatusTitle()
      : publishBlockedByPRLoading
        ? checkingPrStatusTitle()
        : publishBlockedByMergedPR
          ? prAlreadyMergedTitle()
          : publishBlockedByOpenHostedReview
            ? canPushLinkedReviewWithoutUpstream
              ? linkedReviewBranchExistsTitle()
              : linkedReviewTargetUnavailableTitle()
            : publishBlockedByDetachedHead
              ? checkoutBeforePublishTitle()
              : hasUpstream
                ? branchAlreadyPublishedTitle()
                : publishBranchToOriginTitle(),
    disabled:
      globalBusy ||
      upstreamLoading ||
      hasUpstream ||
      publishBlockedByPRLoading ||
      publishBlockedByMergedPR ||
      publishBlockedByOpenHostedReview ||
      publishBlockedByDetachedHead
  }

  return { push, forcePush, pull, fastForward, sync, rebase, fetch, publish }
}
