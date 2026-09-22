import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'

const terminalPaneSource = readFileSync(path.join(import.meta.dirname, 'TerminalPane.tsx'), 'utf8')

const DEFAULT_SHELL_KEYS = [
  'searchTitle',
  'searchDescription',
  'title',
  'description',
  'ariaLabel',
  'systemOption',
  'customOption',
  'customExecutableAria',
  'help',
  'notFound'
] as const

function placeholders(value: string): string[] {
  return (value.match(/\{\{[^}]+\}\}/g) ?? []).sort()
}

describe('TerminalPane default shell localization', () => {
  it('routes every user-facing default-shell string through translate', () => {
    for (const key of DEFAULT_SHELL_KEYS) {
      expect(terminalPaneSource).toContain(
        `'auto.components.settings.TerminalPane.defaultShell.${key}'`
      )
    }
  })

  it('ships complete Chinese copy with matching interpolation placeholders', () => {
    const english = en.auto.components.settings.TerminalPane.defaultShell
    const chinese = zh.auto.components.settings.TerminalPane.defaultShell

    for (const key of DEFAULT_SHELL_KEYS) {
      expect(chinese[key], `${key} should be translated`).toBeTruthy()
      expect(chinese[key], `${key} should not fall back to English`).not.toBe(english[key])
      expect(placeholders(chinese[key]), `${key} placeholders should match`).toEqual(
        placeholders(english[key])
      )
    }
  })
})
