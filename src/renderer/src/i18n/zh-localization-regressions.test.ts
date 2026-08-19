import { afterEach, describe, expect, it } from 'vitest'
import { getCheckCountChips } from '../components/pr-check-counts'
import { STATUS_LABELS } from '../components/settings/SshTargetCard'
import { getTaskSourceContextSummary } from '../components/task-source-context-summary'
import { formatTaskSourceErrorMessage } from '../lib/task-source-error-copy'
import { getOsRevealLabel } from '../lib/os-reveal-label'
import { setRendererUiLanguage, translate } from './i18n'

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('Chinese localization regressions', () => {
  it('localizes skill sharing and workspace cleanup copy', async () => {
    await setRendererUiLanguage('zh')

    expect(translate('auto.components.settings.shareSkills.title', 'Share Skills')).toBe('分享技能')
    expect(translate('components.workspace.cleanup.browse.filters', 'Filters')).toBe('筛选器')
    expect(
      translate(
        'auto.components.status.bar.ResourceUsageStatusSegment.92924a14e3',
        'Clean up workspaces'
      )
    ).toBe('清理工作区')
  })

  it('localizes host, check, file-manager, and task-source labels', async () => {
    await setRendererUiLanguage('zh')

    expect(
      getTaskSourceContextSummary({
        provider: 'jira',
        providerLabel: 'Jira',
        hostLabelById: new Map([['local', 'Local Windows']])
      }).label
    ).toBe('Jira · 本地 Windows · 当前账户')
    expect(STATUS_LABELS.disconnected).toBe('已断开连接')
    expect(getOsRevealLabel('windows')).toBe('在文件资源管理器中显示')
    expect(
      getCheckCountChips({ passing: 0, failing: 7, needsAction: 0, pending: 0, neutral: 0 })
    ).toEqual([{ tone: 'failure', label: '7 失败' }])
  })

  it('localizes stable task-source CLI error framing', async () => {
    await setRendererUiLanguage('zh')

    expect(
      formatTaskSourceErrorMessage('Invalid request — Command failed: gh: Validation Failed')
    ).toBe('请求无效 — 命令执行失败： gh: 验证失败')
  })
})
