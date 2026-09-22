// Why: the two review-creation rows share one blocked-reason string, so the "Push first" hint on
// Create PR and the tooltip on Push-before-PR can never disagree.

import { translate } from '@/i18n/i18n'
import { supportsHostedReviewCreation } from '../../../../shared/hosted-review-creation-providers'
import {
  localizedHostedReviewCopy,
  resolveSupportedHostedReviewCopyProvider
} from '@/i18n/hosted-review-localized-copy'
import {
  canClickBlockedCreateReviewReason,
  resolveHostedReviewAuthInstruction
} from './source-control-create-review-blocked-action'
import type { PrimaryActionInputs } from './source-control-primary-action'
import type { DropdownItem } from './source-control-dropdown-item-types'
import type { DropdownActionContext } from './source-control-dropdown-action-context'
import {
  authRequiredInEnvironmentTitle,
  baseBranchNotOnRemoteTitle,
  branchNotReadyTitle,
  checkoutBranchFirstTitle,
  commitChangesFirstTitle,
  createReviewForBranchTitle,
  forcePushBeforeCreateReviewTitle,
  forcePushFirstTitle,
  forkHeadUnsupportedTitle,
  pushBeforeCreateReviewTitle,
  pushFirstTitle,
  reviewAlreadyExistsTitle,
  switchToFeatureBranchTitle,
  syncFirstTitle,
  unsupportedProviderTitle
} from './source-control-dropdown-review-status-titles'
import { checkingBranchStatusTitle } from './source-control-dropdown-status-titles'

export type HostedReviewDropdownItems = {
  createPR: DropdownItem
  pushCreatePR: DropdownItem
}

function reviewCopy(
  provider: NonNullable<PrimaryActionInputs['hostedReviewCreation']>['provider'] | undefined
): ReturnType<typeof localizedHostedReviewCopy> & {
  authInstruction: string
} {
  return {
    ...localizedHostedReviewCopy(resolveSupportedHostedReviewCopyProvider(provider)),
    authInstruction: resolveHostedReviewAuthInstruction(provider ?? 'github')
  }
}

export function buildHostedReviewDropdownItems(
  ctx: DropdownActionContext
): HostedReviewDropdownItems {
  const { hostedReviewCreation, globalBusy, upstreamLoading, shouldForcePushWithLease } = ctx
  const createReviewCopy = reviewCopy(hostedReviewCreation?.provider)

  const createBlockedHint = ((): string => {
    switch (hostedReviewCreation?.blockedReason) {
      case 'dirty':
        return commitChangesFirstTitle()
      case 'detached_head':
        return checkoutBranchFirstTitle()
      case 'default_branch':
        return switchToFeatureBranchTitle()
      case 'no_upstream':
        return translate(
          'auto.components.right.sidebar.source.control.dropdown.remote.items.publish.branch',
          'Publish Branch'
        )
      case 'needs_push':
        return pushFirstTitle()
      case 'needs_sync':
        return shouldForcePushWithLease ? forcePushFirstTitle() : syncFirstTitle()
      case 'auth_required':
        return authRequiredInEnvironmentTitle(createReviewCopy.authInstruction)
      case 'unsupported_provider':
        return unsupportedProviderTitle()
      case 'existing_review':
        return reviewAlreadyExistsTitle(createReviewCopy.reviewLabel)
      case 'fork_head_unsupported':
        return forkHeadUnsupportedTitle()
      case 'base_not_on_remote':
        return baseBranchNotOnRemoteTitle()
      case null:
      case undefined:
        return upstreamLoading ? checkingBranchStatusTitle() : branchNotReadyTitle()
    }
  })()

  const createPR: DropdownItem = {
    kind: 'create_pr',
    label: translate(
      'auto.components.right.sidebar.source.control.dropdown.items.9e779995dd',
      'Create {{value0}}',
      { value0: createReviewCopy.shortLabel }
    ),
    title: hostedReviewCreation?.canCreate
      ? createReviewForBranchTitle(createReviewCopy.reviewLabel)
      : createBlockedHint,
    hint: hostedReviewCreation?.canCreate ? undefined : createBlockedHint,
    disabled:
      globalBusy ||
      !supportsHostedReviewCreation(hostedReviewCreation?.provider) ||
      (!hostedReviewCreation?.canCreate &&
        !canClickBlockedCreateReviewReason(hostedReviewCreation?.blockedReason))
  }

  const canPushAndCreate =
    !globalBusy &&
    !upstreamLoading &&
    supportsHostedReviewCreation(hostedReviewCreation?.provider) &&
    (hostedReviewCreation.blockedReason === 'needs_push' ||
      (hostedReviewCreation.blockedReason === 'needs_sync' && shouldForcePushWithLease))
  const pushCreatePR: DropdownItem = {
    kind: 'push_create_pr',
    label: shouldForcePushWithLease
      ? translate(
          'auto.components.rightSidebar.sourceControl.forcePushBeforeReviewLabel',
          'Force Push before {{shortLabel}}',
          { shortLabel: createReviewCopy.shortLabel }
        )
      : translate(
          'auto.components.rightSidebar.sourceControl.pushBeforeReviewLabel',
          'Push before {{shortLabel}}',
          { shortLabel: createReviewCopy.shortLabel }
        ),
    title: canPushAndCreate
      ? shouldForcePushWithLease
        ? forcePushBeforeCreateReviewTitle(createReviewCopy.reviewLabel)
        : pushBeforeCreateReviewTitle(createReviewCopy.reviewLabel)
      : createBlockedHint,
    hint: canPushAndCreate ? undefined : createBlockedHint,
    disabled: !canPushAndCreate
  }

  return { createPR, pushCreatePR }
}
