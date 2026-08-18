// Why: the three commit rows share one disabled-reason ladder — commit, commit+push and commit+sync
// must never disagree about why committing is blocked.

import { translate } from '@/i18n/i18n'
import type { DropdownItem } from './source-control-dropdown-item-types'
import type { DropdownActionContext } from './source-control-dropdown-action-context'
import {
  checkingBranchStatusTitle,
  checkingPrStatusTitle,
  checkoutBeforePushTitle,
  checkoutBeforeSyncTitle,
  commitAndForcePushWithLeaseTitle,
  commitAndPushTitle,
  commitAndTryPushTitle,
  commitStagedChangesTitle,
  commitThenPullPushTitle,
  linkedReviewTargetUnavailableTitle,
  prAlreadyMergedTitle,
  preferCommitAndForcePushTitle,
  publishFirstToPushTitle,
  publishFirstToSyncTitle
} from './source-control-dropdown-status-titles'

export type CommitDropdownItems = {
  commit: DropdownItem
  commitPush: DropdownItem
  commitSync: DropdownItem
}

export function buildCommitDropdownItems(ctx: DropdownActionContext): CommitDropdownItems {
  const {
    globalBusy,
    upstreamLoading,
    hasUpstream,
    hasOpenHostedReview,
    canPushLinkedReviewWithoutUpstream,
    pushBlockedByOpenHostedReviewTarget,
    publishBlockedByMergedPR,
    publishBlockedByPRLoading,
    publishBlockedByDetachedHead,
    behind,
    shouldForcePushWithLease,
    commitDisabledReason,
    canCommit
  } = ctx

  const commit: DropdownItem = {
    kind: 'commit',
    label: translate(
      'auto.components.right.sidebar.source.control.dropdown.items.2b8e6595fd',
      'Commit'
    ),
    title: commitDisabledReason ?? commitStagedChangesTitle(),
    disabled: !canCommit
  }

  // Why: compound commit labels omit counts — the commit itself changes ahead/behind, so pre-commit numbers would mislead.
  const commitPushTitle = upstreamLoading
    ? checkingBranchStatusTitle()
    : publishBlockedByPRLoading
      ? checkingPrStatusTitle()
      : publishBlockedByMergedPR
        ? prAlreadyMergedTitle()
        : publishBlockedByDetachedHead
          ? checkoutBeforePushTitle()
          : pushBlockedByOpenHostedReviewTarget
            ? linkedReviewTargetUnavailableTitle()
            : !hasUpstream && !(hasOpenHostedReview && canPushLinkedReviewWithoutUpstream)
              ? publishFirstToPushTitle()
              : (commitDisabledReason ??
                (shouldForcePushWithLease
                  ? commitAndForcePushWithLeaseTitle()
                  : behind > 0
                    ? commitAndTryPushTitle()
                    : commitAndPushTitle()))
  const commitPush: DropdownItem = {
    kind: 'commit_push',
    label: shouldForcePushWithLease
      ? translate(
          'auto.components.right.sidebar.source.control.dropdown.commit.items.a1b2c3d4e5',
          'Commit & Force Push'
        )
      : translate(
          'auto.components.right.sidebar.source.control.dropdown.commit.items.f6g7h8i9j0',
          'Commit & Push'
        ),
    title: commitPushTitle,
    // Why: match explicit Push — only an open linked review with a known head can commit+push without a git upstream.
    disabled:
      globalBusy ||
      upstreamLoading ||
      (!hasUpstream && !(hasOpenHostedReview && canPushLinkedReviewWithoutUpstream)) ||
      publishBlockedByDetachedHead ||
      publishBlockedByPRLoading ||
      publishBlockedByMergedPR ||
      commitDisabledReason !== null
  }

  const commitSyncTitle = ((): string => {
    if (upstreamLoading) {
      return checkingBranchStatusTitle()
    }
    if (publishBlockedByPRLoading) {
      return checkingPrStatusTitle()
    }
    if (publishBlockedByMergedPR) {
      return prAlreadyMergedTitle()
    }
    if (publishBlockedByDetachedHead) {
      return checkoutBeforeSyncTitle()
    }
    if (!hasUpstream) {
      // Why: direct the user to Publish Branch (the primary action) rather than naming a nonexistent compound action.
      return publishFirstToSyncTitle()
    }
    if (shouldForcePushWithLease) {
      return commitDisabledReason ?? preferCommitAndForcePushTitle()
    }
    return commitDisabledReason ?? commitThenPullPushTitle()
  })()
  const commitSync: DropdownItem = {
    kind: 'commit_sync',
    label: translate(
      'auto.components.right.sidebar.source.control.dropdown.items.323bb614aa',
      'Commit & Sync'
    ),
    title: commitSyncTitle,
    disabled:
      globalBusy ||
      upstreamLoading ||
      !hasUpstream ||
      publishBlockedByDetachedHead ||
      shouldForcePushWithLease ||
      commitDisabledReason !== null
  }

  return { commit, commitPush, commitSync }
}
