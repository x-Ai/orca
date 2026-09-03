import { afterEach, describe, expect, it } from 'vitest'
import { getCheckCountChips } from '../components/pr-check-counts'
import { STATUS_LABELS } from '../components/settings/SshTargetCard'
import { getTaskSourceContextSummary } from '../components/task-source-context-summary'
import {
  translateExecutionHostDetail,
  translateExecutionHostLabel
} from '../components/sidebar/execution-host-label'
import {
  translateDefaultWorkflowStateLabel,
  translateWorkspaceBoardStatusLabel
} from '../components/sidebar/workspace-board-status-label'
import {
  translateProjectOptionDetail,
  translateProjectOptionSectionHeading
} from '../components/new-workspace/project-combobox-localized-copy'
import {
  localizedPluginCategory,
  localizedPluginDescription,
  localizedPluginName
} from '../components/plugin-catalog/plugin-localized-metadata'
import { formatGitHubProjectErrorMessage } from '../lib/github-project-error-copy'
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

  it('localizes host selectors, project errors, and default workspace statuses', async () => {
    await setRendererUiLanguage('zh')

    expect(translateExecutionHostLabel('Local Windows')).toBe('本地 Windows')
    expect(translateExecutionHostLabel('All hosts')).toBe('所有主机')
    expect(translateExecutionHostDetail('This computer')).toBe('此计算机')
    expect(formatGitHubProjectErrorMessage('Project or view not found.')).toBe('找不到项目或视图。')
    expect(translateWorkspaceBoardStatusLabel({ id: 'in-progress', label: 'In progress' })).toBe(
      '进行中'
    )
    expect(translateDefaultWorkflowStateLabel('In progress')).toBe('进行中')
    expect(translateDefaultWorkflowStateLabel('Status 5')).toBe('状态 5')
    expect(translateProjectOptionSectionHeading({ key: 'recent', heading: 'Recent' })).toBe(
      '最近使用'
    )
    expect(translateProjectOptionDetail('Project')).toBe('项目')
    expect(translateProjectOptionDetail('/workspace/Project')).toBe('/workspace/Project')
    expect(translate('auto.components.TaskPage.00022ec0ba', 'Project')).toBe('项目')
    expect(
      translate('auto.components.skills.SkillInstallTargetFields.8562dd1e6e', 'This computer')
    ).toBe('此计算机')
  })

  it('localizes official plugin metadata and diff whitespace settings', async () => {
    await setRendererUiLanguage('zh')

    expect(
      localizedPluginName('stablyai.orca-navigation-shortcuts', 'Orca Navigation Shortcuts', true)
    ).toBe('Orca 导航快捷键')
    expect(
      localizedPluginDescription(
        'stablyai.orca-navigation-shortcuts',
        'Command aliases and optional shortcuts for frequent Orca views.',
        true
      )
    ).toBe('为常用 Orca 视图提供命令别名和可选快捷键。')
    expect(localizedPluginCategory('keybindings')).toBe('快捷键')
    expect(localizedPluginName('example.plugin', 'External Plugin', false)).toBe('External Plugin')
    expect(
      localizedPluginDescription(
        'stablyai.orca-navigation-shortcuts',
        'A newer marketplace description.',
        true
      )
    ).toBe('A newer marketplace description.')
    expect(
      translate(
        'auto.components.settings.GeneralEditorSettingsSection.f1b3ceeb98',
        'Diff Show Whitespace'
      )
    ).toBe('在差异中显示空白字符')
  })

  it('localizes automation and remote browsing settings copy', async () => {
    await setRendererUiLanguage('zh')

    expect(
      translate(
        'auto.components.automations.emptyState.allHostsEmpty',
        'No automations across loaded hosts'
      )
    ).toBe('已加载的主机中没有自动化')
    expect(translate('auto.components.automations.hostPicker.allHosts', 'All hosts')).toBe(
      '所有主机'
    )
    expect(
      translate('auto.components.automations.hostStatus.execution.disconnected', 'Not connected')
    ).toBe('未连接')
    expect(
      translate(
        'auto.components.settings.OrchestrationPane.nestedWorkerDepthTitle',
        'Nested worker depth'
      )
    ).toBe('嵌套工作进程深度')
    expect(translate('settings.browser.remoteBrowsing.heading', 'Remote browsing')).toBe('远程浏览')
    expect(translate('settings.browser.clientHostedRemote.optionDevice', 'This device')).toBe(
      '此设备'
    )
    expect(translate('settings.browser.sshWorkspaceRouting.optionHost', 'SSH host')).toBe(
      'SSH 主机'
    )
    expect(
      translate(
        'auto.components.terminal.pane.TerminalLinkActionPopover.systemBrowser',
        'System Browser'
      )
    ).toBe('系统浏览器')
    expect(
      translate(
        'auto.components.terminal.pane.TerminalLinkActionPopover.orcaBrowser',
        'Orca Browser'
      )
    ).toBe('Orca 浏览器')
    expect(
      translate(
        'auto.components.BrowserCookieImportMachineNotice.clientLabel',
        'Browsers on this device'
      )
    ).toBe('此设备上的浏览器')
  })
})
