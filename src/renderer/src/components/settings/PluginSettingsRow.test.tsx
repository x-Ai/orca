// @vitest-environment happy-dom

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PluginHostListEntry } from '../../../../preload/api-types'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { PluginSettingsRow } from './PluginSettingsRow'

vi.mock('../ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onSelect
  }: {
    children: React.ReactNode
    onSelect?: () => void
  }) => <button onClick={onSelect}>{children}</button>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

const plugin: PluginHostListEntry = {
  pluginKey: 'stablyai.orca-skills',
  consentFingerprint: 'sha256-consent',
  name: 'Orca Skills',
  version: '1.0.0',
  publisher: 'stablyai',
  status: 'disabled',
  needsReconsent: false,
  isDev: false,
  official: true,
  bundled: true,
  capabilities: [],
  panels: [],
  commands: [],
  hasWorker: false,
  restarts: 0,
  blockedByKillList: {
    reason: 'A vulnerable release was revoked',
    advisoryUrl: 'https://onorca.dev/advisories/orca-skills'
  },
  source: {
    kind: 'bundled',
    reference: 'bundled:stablyai.orca-skills',
    resolvedCommit: null,
    contentHash: 'sha256-content'
  }
}

afterEach(async () => {
  document.body.innerHTML = ''
  await setRendererUiLanguage('en')
})

describe('PluginSettingsRow', () => {
  it('shows official provenance and prevents re-enabling killed plugins', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    await act(async () => {
      root.render(
        <PluginSettingsRow
          plugin={plugin}
          busy={false}
          logsOpen={false}
          onReview={vi.fn()}
          onToggleEnabled={vi.fn()}
          onToggleLogs={vi.fn()}
          onRollbackRequest={vi.fn()}
          onRemoveRequest={vi.fn()}
        />
      )
    })

    // Why: official provenance renders as an icon with an accessible label, not badge text.
    expect(container.querySelector('[aria-label="Official"]')).toBeTruthy()
    expect(container.textContent).toContain('Bundled')
    expect(container.textContent).toContain('A vulnerable release was revoked')
    expect(container.textContent).toContain('View advisory')
    expect(container.textContent).not.toContain('Remove')
    expect(
      container.querySelector<HTMLButtonElement>('[aria-label="Enable Orca Skills"]')?.disabled
    ).toBe(true)
    act(() => root.unmount())
  })

  it('renders localized metadata for a known official plugin', async () => {
    await setRendererUiLanguage('zh')
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    await act(async () => {
      root.render(
        <PluginSettingsRow
          plugin={{
            ...plugin,
            pluginKey: 'stablyai.orca-navigation-shortcuts',
            name: 'Orca Navigation Shortcuts',
            description: 'Command aliases and optional shortcuts for frequent Orca views.',
            blockedByKillList: undefined
          }}
          busy={false}
          logsOpen={false}
          onReview={vi.fn()}
          onToggleEnabled={vi.fn()}
          onToggleLogs={vi.fn()}
          onRollbackRequest={vi.fn()}
          onRemoveRequest={vi.fn()}
        />
      )
    })

    expect(container.textContent).toContain('Orca 导航快捷键')
    expect(container.textContent).toContain('为常用 Orca 视图提供命令别名和可选快捷键。')
    act(() => root.unmount())
  })
})
