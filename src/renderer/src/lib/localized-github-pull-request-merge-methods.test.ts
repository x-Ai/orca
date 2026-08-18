import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@/i18n/i18n'
import { resolveLocalizedGitHubPRMergeMethods } from './localized-github-pull-request-merge-methods'

afterEach(async () => {
  await i18n.changeLanguage('en')
})

describe('localized GitHub pull request merge methods', () => {
  it('localizes every merge method and the primary label', async () => {
    await i18n.changeLanguage('zh')
    const presentation = resolveLocalizedGitHubPRMergeMethods()

    expect(presentation.defaultLabel).toBe('压缩并合并')
    expect(presentation.methods.map(({ label }) => label)).toEqual([
      '压缩并合并',
      '创建合并提交',
      '变基并合并'
    ])
  })
})
