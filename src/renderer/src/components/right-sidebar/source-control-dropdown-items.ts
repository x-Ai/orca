// Why: split from source-control-primary-action — primary and dropdown are independent derivations with different priority ladders.

import { translate } from '@/i18n/i18n'
import type { DropdownActionInputs, DropdownEntry } from './source-control-dropdown-item-types'
import { deriveDropdownActionContext } from './source-control-dropdown-action-context'
import { buildCommitDropdownItems } from './source-control-dropdown-commit-items'
import { buildRemoteDropdownItems } from './source-control-dropdown-remote-items'
import { buildHostedReviewDropdownItems } from './source-control-dropdown-review-items'
import {
  abortConflictInProgressTitle,
  operationInProgressTitle
} from './source-control-dropdown-review-status-titles'

/**
 * Resolve the chevron dropdown items. Every row is always rendered — disabled with a
 * tooltip reason rather than hidden — so the menu shape stays stable across states.
 */
export function resolveDropdownItems(inputs: DropdownActionInputs): DropdownEntry[] {
  const ctx = deriveDropdownActionContext(inputs)
  const { commit, commitPush, commitSync } = buildCommitDropdownItems(ctx)
  const { push, forcePush, pull, fastForward, sync, rebase, fetch, publish } =
    buildRemoteDropdownItems(ctx)
  const { createPR, pushCreatePR } = buildHostedReviewDropdownItems(ctx)
  const { conflictOperation, isPullRequestOperationActive, globalBusy } = ctx

  const entries: DropdownEntry[] = [
    commit,
    commitPush,
    commitSync,
    { kind: 'separator', id: 'before-remote' },
    push,
    forcePush,
    createPR,
    pushCreatePR,
    pull,
    fastForward,
    sync,
    rebase,
    fetch,
    publish
  ]
  if (conflictOperation === 'merge' || conflictOperation === 'rebase') {
    const isRebase = conflictOperation === 'rebase'
    const label = isRebase
      ? translate('auto.components.right.sidebar.SourceControl.425f138269', 'Abort rebase')
      : translate('auto.components.right.sidebar.SourceControl.540ca8f78c', 'Abort merge')
    const operation = isRebase
      ? translate('auto.components.right.sidebar.SourceControl.04832d8047', 'rebase')
      : translate('auto.components.right.sidebar.SourceControl.c105a61960', 'merge')
    entries.push(
      { kind: 'separator', id: 'before-abort' },
      {
        kind: isRebase ? 'abort_rebase' : 'abort_merge',
        label,
        title: globalBusy ? operationInProgressTitle() : abortConflictInProgressTitle(operation),
        disabled: globalBusy,
        variant: 'destructive'
      }
    )
  }
  if (!isPullRequestOperationActive) {
    return entries
  }
  return entries.map((entry) =>
    entry.kind === 'separator'
      ? entry
      : {
          ...entry,
          title: translate(
            'auto.components.right.sidebar.source.control.dropdown.items.7aad2c0240',
            'Hosted review operation in progress…'
          ),
          disabled: true
        }
  )
}
