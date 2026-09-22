import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@/i18n/i18n'
import { resolveDropdownItems } from './source-control-dropdown-items'
import type { DropdownActionInputs } from './source-control-dropdown-item-types'

function inputs(): DropdownActionInputs {
  return {
    stagedCount: 1,
    hasUnstagedChanges: false,
    hasStageableChanges: false,
    hasPartiallyStagedChanges: false,
    hasMessage: true,
    hasUnresolvedConflicts: false,
    isCommitting: false,
    isRemoteOperationActive: false,
    upstreamStatus: { hasUpstream: true, ahead: 2, behind: 0 },
    hostedReviewCreation: {
      provider: 'github',
      review: null,
      canCreate: false,
      blockedReason: 'needs_push',
      nextAction: 'push',
      reviewLookupOutcome: 'not_found'
    }
  }
}

afterEach(async () => {
  await i18n.changeLanguage('en')
})

describe('source control dropdown localization', () => {
  it('localizes the primary Git workflow and review actions in Chinese', async () => {
    await i18n.changeLanguage('zh')
    const entries = resolveDropdownItems(inputs()).filter((entry) => entry.kind !== 'separator')
    const labels = Object.fromEntries(entries.map((entry) => [entry.kind, entry.label]))

    expect(labels).toMatchObject({
      commit: '提交',
      commit_push: '提交并推送',
      commit_sync: '提交并同步',
      push: '推送 (2)',
      force_push: '强制推送 (2)',
      create_pr: '创建 PR',
      push_create_pr: '创建 PR 前推送',
      pull: '拉取',
      fast_forward: '快进',
      sync: '同步 (↓0 ↑2)',
      fetch: '获取'
    })
  })
})
