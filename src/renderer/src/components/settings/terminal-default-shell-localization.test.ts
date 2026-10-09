import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'

const terminalPaneSource = readFileSync(path.join(import.meta.dirname, 'TerminalPane.tsx'), 'utf8')

// Upstream's extracted keys for the default-shell section, by role.
const DEFAULT_SHELL_KEYS = {
  searchTitle: '9589abc009',
  searchDescription: '1c29734248',
  title: 'fd05fb109c',
  description: '69724e8f0c',
  systemOption: 'dd3f4c35da',
  customOption: 'f51cc79784',
  customExecutableAria: '5e06e87730',
  help: '59573d0b33',
  notFound: '5a5eac2f44',
  notFoundAdvice: 'e3ae5aed18'
} as const

function placeholders(value: string): string[] {
  return (value.match(/\{\{[^}]+\}\}/g) ?? []).sort()
}

describe('TerminalPane default shell localization', () => {
  it('routes every user-facing default-shell string through translate', () => {
    for (const key of Object.values(DEFAULT_SHELL_KEYS)) {
      expect(terminalPaneSource).toContain(`'auto.components.settings.TerminalPane.${key}'`)
    }
  })

  it('ships complete Chinese copy with matching interpolation placeholders', () => {
    const english: Record<string, unknown> = en.auto.components.settings.TerminalPane
    const chinese: Record<string, unknown> = zh.auto.components.settings.TerminalPane

    for (const [role, key] of Object.entries(DEFAULT_SHELL_KEYS)) {
      const englishValue = english[key]
      const chineseValue = chinese[key]
      expect(typeof englishValue, `${role} English copy`).toBe('string')
      expect(typeof chineseValue, `${role} should be translated`).toBe('string')
      expect(chineseValue, `${role} should not fall back to English`).not.toBe(englishValue)
      expect(placeholders(String(chineseValue)), `${role} placeholders should match`).toEqual(
        placeholders(String(englishValue))
      )
    }
  })
})
