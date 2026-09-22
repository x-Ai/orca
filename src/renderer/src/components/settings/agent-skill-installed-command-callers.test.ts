import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'

const repoRoot = path.resolve(fileURLToPath(new URL('../../../../../', import.meta.url)))
const componentsRoot = path.join(repoRoot, 'src/renderer/src/components')

const setupTerminalKeys = [
  'auto.components.settings.AgentSkillSetupPanel.browserUseTerminalTitle',
  'auto.components.settings.AgentSkillSetupPanel.browserUseTerminalAria',
  'auto.components.settings.AgentSkillSetupPanel.computerUseTerminalTitle',
  'auto.components.settings.AgentSkillSetupPanel.computerUseTerminalAria',
  'auto.components.settings.AgentSkillSetupPanel.orchestrationTerminalTitle',
  'auto.components.settings.AgentSkillSetupPanel.orchestrationTerminalAria',
  'auto.components.settings.CliSection.cliSkillTerminalTitle',
  'auto.components.settings.CliSection.cliSkillTerminalAria',
  'auto.components.emulator.pane.MobileEmulatorAgentSetupGuideSteps.5c59ea96ca',
  'auto.components.emulator.pane.MobileEmulatorAgentSetupGuideSteps.bff5341ac3'
] as const

const updateCapableCallers = new Map<string, readonly string[]>([
  [
    'src/renderer/src/components/settings/OrchestrationPane.tsx',
    ['ORCHESTRATION_SKILL_UPDATE_COMMAND', 'installedCommand={orchestrationUpdateCommand}']
  ],
  [
    'src/renderer/src/components/settings/OrchestrationSetupCard.tsx',
    ['ORCHESTRATION_SKILL_UPDATE_COMMAND', 'installedCommand={updateCommand}']
  ],
  [
    'src/renderer/src/components/floating-terminal/FloatingTerminalOrchestrationDialog.tsx',
    ['ORCHESTRATION_SKILL_UPDATE_COMMAND', 'installedCommand={updateCommand}']
  ],
  [
    'src/renderer/src/components/settings/ComputerUseSkillSetupPanel.tsx',
    ['COMPUTER_USE_SKILL_UPDATE_COMMAND', 'installedCommand={updateCommand}']
  ],
  [
    // Shared hook owns update-target resolution for Linear settings + Task Sources.
    'src/renderer/src/components/settings/use-linear-agent-skill-setup.ts',
    [
      'getLinearAgentSkillUpdateTarget',
      'updateTarget.command',
      // The builder also reads the focused runtime environment, so memoizing
      // either command on the runtime alone serves a stale Windows host command.
      'const installCommand = activeSkillRuntime.installDisabledReason',
      'const updateCommand = activeSkillRuntime.installDisabledReason'
    ]
  ],
  [
    'src/renderer/src/components/settings/LinearAgentSkillPane.tsx',
    ['installedCommand={skillSetup.updateCommand}']
  ],
  [
    'src/renderer/src/components/settings/TaskSourceLinearSetup.tsx',
    ['installedCommand={skillSetup.updateCommand}']
  ],
  [
    'src/renderer/src/components/settings/EphemeralVmsPane.tsx',
    [
      'EPHEMERAL_VMS_SKILL_UPDATE_COMMAND',
      'installedCommand={updateCommand}',
      // An absent runtime must still resolve to the host so the Windows npx
      // preflight applies, as it does on the sibling panes.
      'const installCommand = activeSkillRuntime.installDisabledReason'
    ]
  ],
  [
    'src/renderer/src/components/settings/CliSection.tsx',
    ['ORCA_CLI_SKILL_UPDATE_COMMAND', 'installedCommand={cliSkillUpdateCommand}']
  ],
  [
    'src/renderer/src/components/settings/BrowserUsePane.tsx',
    ['ORCA_CLI_SKILL_UPDATE_COMMAND', 'installedCommand={browserUseUpdateCommand}']
  ],
  [
    'src/renderer/src/components/settings/BrowserUseSkillStep.tsx',
    ['installedCommand={installedCommand}']
  ],
  [
    'src/renderer/src/components/feature-wall/BrowserUseSkillSetupCard.tsx',
    ['ORCA_CLI_SKILL_UPDATE_COMMAND', 'installedCommand={updateCommand}']
  ],
  [
    // Why: the single-skill update command selection moved into
    // getLinearAgentSkillUpdateCommand so the settings install CTA shares it.
    'src/renderer/src/components/sidebar/LinearAgentSkillSetupPrompt.tsx',
    ['getLinearAgentSkillUpdateCommand', 'installedCommand={installedCommand}']
  ],
  [
    'src/renderer/src/components/sidebar/LinearAgentSkillSetupDialog.tsx',
    ['installedCommand={installedCommand}']
  ],
  [
    'src/renderer/src/components/settings/MobileEmulatorAgentControlRow.tsx',
    [
      'ORCA_CLI_SKILL_UPDATE_COMMAND',
      'installedCommand={cliSkillUpdateCommand}',
      'terminalShellOverride={activeSkillRuntime.terminalShellOverride}',
      // Detection here scans the local host only, so the command must stay host-built.
      'buildSkillCommandForRuntime(ORCA_CLI_SKILL_INSTALL_COMMAND)',
      'buildSkillCommandForRuntime(ORCA_CLI_SKILL_UPDATE_COMMAND)'
    ]
  ]
])

const installOnlyCallers = new Map<string, readonly string[]>([
  [
    'src/renderer/src/components/emulator-pane/MobileEmulatorAgentSetupGuideSteps.tsx',
    [
      // Detection here scans the local host only, so the command must stay host-built.
      'buildSkillCommandForRuntime(ORCA_CLI_SKILL_INSTALL_COMMAND)',
      'command={skillInstallCommand}',
      'terminalShellOverride={activeSkillRuntime.terminalShellOverride}',
      'showInstallWhenInstalled={!setup.cliSkillInstalled}'
    ]
  ]
])

const directPanelCallers = new Set([
  // BrowserUsePane and LinearAgentSkillSetupPrompt delegate through child setup
  // components that forward installedCommand and are validated separately above.
  // use-linear-agent-skill-setup owns the update-target resolver but is not a panel host.
  ...[...updateCapableCallers.keys()].filter(
    (relativePath) =>
      relativePath !== 'src/renderer/src/components/settings/BrowserUsePane.tsx' &&
      relativePath !== 'src/renderer/src/components/sidebar/LinearAgentSkillSetupPrompt.tsx' &&
      relativePath !== 'src/renderer/src/components/settings/use-linear-agent-skill-setup.ts'
  ),
  ...installOnlyCallers.keys()
])

function relativeRepoPath(filePath: string): string {
  return path.relative(repoRoot, filePath).split(path.sep).join('/')
}

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

function localeValue(locale: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((node, part) => {
    if (!isRecord(node)) {
      return undefined
    }
    return node[part]
  }, locale)
  return typeof value === 'string' ? value : undefined
}

function findProductionPanelCallers(dir: string): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir)) {
    const entryPath = path.join(dir, entry)
    const stat = statSync(entryPath)
    if (stat.isDirectory()) {
      found.push(...findProductionPanelCallers(entryPath))
      continue
    }
    if (!entryPath.endsWith('.tsx') || entryPath.includes('.test.')) {
      continue
    }
    const source = readFileSync(entryPath, 'utf8')
    if (source.includes('<AgentSkillSetupPanel')) {
      found.push(relativeRepoPath(entryPath))
    }
  }
  return found.sort()
}

describe('AgentSkillSetupPanel installed-command call sites', () => {
  it('keeps every update-capable production caller on an explicit single-skill update command', () => {
    for (const [relativePath, expectedSnippets] of updateCapableCallers) {
      const source = readRepoFile(relativePath)
      for (const snippet of expectedSnippets) {
        expect(source, `${relativePath} should include ${snippet}`).toContain(snippet)
      }
    }
  })

  it('keeps orchestration installed updates on the primary panel only', () => {
    const source = readRepoFile('src/renderer/src/components/settings/OrchestrationPane.tsx')

    expect(source).toContain('installedCommand={orchestrationUpdateCommand}')
    expect(source).not.toContain('Copy update command')
    expect(source).not.toContain('copyUpdateCommand')
  })

  it('routes the combined feature-tip install through runtime command setup', () => {
    const source = readRepoFile(
      'src/renderer/src/components/feature-tips/CliSkillSetupTerminal.tsx'
    )

    expect(source).toContain('buildSkillCommandForRuntime(')
    // Clipboard and auto-paste share the source command until the created tab
    // resolves the shell that prepares the executable form.
    expect(source).toContain('writeClipboardText(skillCommand)')
    expect(source).toContain('command={skillCommand}')
    expect(source).toContain('prepareCommandForShell={prepareCommandForShell}')
    expect(source).toContain('shellOverride={activeSkillRuntime.terminalShellOverride}')
    expect(source).not.toContain('command={ORCA_CLI_ORCHESTRATION_SKILL_INSTALL_COMMAND}')
    // This terminal auto-pastes with no install gate, so a repair-required runtime
    // must fall back to the host rather than skip the Windows npx preflight.
    expect(source).toContain(
      'activeSkillRuntime.installDisabledReason ? undefined : activeSkillRuntime.agentRuntime'
    )
  })

  it('keeps client freshness behind resolved local runtime authority', () => {
    const expectedGates = new Map<string, string>([
      [
        'src/renderer/src/components/settings/use-local-cli-skill-freshness-name.ts',
        "agentRuntime.runtime === 'host' && activeSkillRuntime.canUseLocalSkillFreshness"
      ],
      [
        'src/renderer/src/components/settings/MobileEmulatorAgentControlRow.tsx',
        'activeSkillRuntime.canUseLocalSkillFreshness ? ORCA_CLI_SKILL_NAME : undefined'
      ],
      [
        'src/renderer/src/components/settings/use-settings-store-model.ts',
        'useSkillFreshness(skillFreshnessApplies)'
      ],
      [
        'src/renderer/src/components/skills/SkillFreshnessNudge.tsx',
        'useSkillFreshness(activeSkillRuntime.canUseLocalSkillFreshness)'
      ],
      [
        'src/renderer/src/components/skills/SkillFreshnessUpdateDialog.tsx',
        'useSkillFreshness(activeSkillRuntime.canUseLocalSkillFreshness)'
      ]
    ])

    for (const [relativePath, expectedGate] of expectedGates) {
      expect(readRepoFile(relativePath), relativePath).toContain(expectedGate)
    }
  })

  it('fails when a production caller can show the default Update action without installedCommand', () => {
    const productionCallers = findProductionPanelCallers(componentsRoot)

    expect(productionCallers).toEqual([...directPanelCallers].sort())

    for (const [relativePath, expectedSnippets] of installOnlyCallers) {
      const source = readRepoFile(relativePath)
      expect(source, `${relativePath} intentionally hides the installed action`).not.toContain(
        'installedCommand='
      )
      for (const snippet of expectedSnippets) {
        expect(source, `${relativePath} should include ${snippet}`).toContain(snippet)
      }
    }
  })

  it('localizes setup-terminal titles and accessible labels at every production caller', () => {
    for (const relativePath of findProductionPanelCallers(componentsRoot)) {
      const source = readRepoFile(relativePath)
      expect(source, `${relativePath} should localize terminalTitle`).toMatch(
        /terminalTitle=\{translate\(/
      )
      expect(source, `${relativePath} should localize terminalAriaLabel`).toMatch(
        /terminalAriaLabel=\{translate\(/
      )
      expect(source, `${relativePath} should not hardcode setup terminal chrome`).not.toMatch(
        /terminal(?:Title|AriaLabel)="[^"]+"/
      )
    }

    for (const key of setupTerminalKeys) {
      const english = localeValue(en, key)
      const chinese = localeValue(zh, key)
      expect(english, `${key} should exist in en.json`).toBeTruthy()
      expect(chinese, `${key} should exist in zh.json`).toBeTruthy()
      expect(chinese, `${key} should not fall back to English`).not.toBe(english)
    }
  })
})
