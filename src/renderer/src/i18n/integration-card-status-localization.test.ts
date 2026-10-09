/**
 * Integration cards build their status pill inside the JSX call, which the
 * coverage audit does not inspect — it looks at JSX attributes and object
 * properties, not conditional expressions passed to a prop. These assertions
 * pin the catalog contract so a card that goes back to a bare literal fails here.
 */
import { describe, expect, it } from 'vitest'
import en from './locales/en.json'
import zh from './locales/zh.json'

function lookup(catalog: unknown, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
      catalog
    )
  return typeof value === 'string' ? value : undefined
}

const REQUIRED_KEYS: Record<string, string> = {
  // Linear and other task trackers
  'auto.components.settings.task.tracker.integration.cards.statusConnected': 'Connected',
  'auto.components.settings.task.tracker.integration.cards.statusNotConnected': 'Not connected',
  // Jira
  'auto.components.settings.jira.integration.card.statusConnected': 'Connected',
  'auto.components.settings.jira.integration.card.statusNotConnected': 'Not connected',
  // Bitbucket, Azure DevOps, Gitea
  'auto.components.settings.token.source.control.integration.cards.statusConnected': 'Connected',
  'auto.components.settings.token.source.control.integration.cards.statusConfigured': 'Configured',
  'auto.components.settings.token.source.control.integration.cards.statusUnavailable':
    'Unavailable',
  'auto.components.settings.token.source.control.integration.cards.statusNotConfigured':
    'Not configured',
  'auto.components.settings.token.source.control.integration.cards.statusOptionalSetup':
    'Optional setup',
  'auto.components.settings.token.source.control.integration.cards.statusAuthFailed': 'Auth failed'
}

describe('integration card status labels', () => {
  it.each(Object.entries(REQUIRED_KEYS))('keeps %s in the English catalog', (key, expected) => {
    expect(lookup(en, key)).toBe(expected)
  })

  it.each([
    ['793a06e899', '重新检查'],
    ['1a9475dace', '了解更多'],
    ['0eb50d5593', '通过 Azure DevOps REST API 令牌获取拉取请求和构建状态'],
    ['7bbc9c64f0', '设置'],
    ['087feb92f1', '，或设置'],
    ['b8a10b07c1', ''],
    ['7bd345e3f6', '仅在 Orca 无法从 Git 远程地址推导出 API 基础 URL 时才需要设置'],
    ['05863d2599', '通过 Gitea REST API 获取拉取请求和提交状态'],
    ['fcbe0469fd', '公开仓库会根据 Git 远程地址自动检测，请设置'],
    ['6da9dfa5de', '用于私有仓库'],
    ['60708f23da', '仅在 Orca 无法从 Git 远程地址推导出 API URL 时才需要设置'],
    ['statusNotConfigured', '未配置'],
    ['statusOptionalSetup', '可选设置']
  ])('localizes token source-control card copy %s in Chinese', (suffix, expected) => {
    expect(
      lookup(zh, `auto.components.settings.token.source.control.integration.cards.${suffix}`)
    ).toBe(expected)
  })
})
