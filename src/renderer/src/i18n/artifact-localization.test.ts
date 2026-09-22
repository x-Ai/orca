import { afterEach, describe, expect, it } from 'vitest'
import { setRendererUiLanguage, translate } from './i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

function flattenCatalog(catalog: object, prefix = ''): Record<string, string> {
  return Object.fromEntries(
    Object.entries(catalog).flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key
      return typeof value === 'string'
        ? [[path, value]]
        : Object.entries(flattenCatalog(value, path))
    })
  )
}

const english = flattenCatalog(en)
const chinese = flattenCatalog(zh)
const placeholders = /\{\{[^}]+\}\}/g

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('Chinese artifact localization', () => {
  it('resolves sidebar, settings, account, and page labels using their original keys', async () => {
    await setRendererUiLanguage('zh')

    expect(translate('auto.components.sidebar.SidebarNav.artifacts', 'Artifacts')).toBe('产物')
    expect(translate('auto.hooks.useSettingsNavigationMetadata.artifactsTitle', 'Artifacts')).toBe(
      '产物'
    )
    expect(
      translate('auto.components.settings.orcaAccount.artifactsTitle', 'Artifact sharing')
    ).toBe('产物分享')
    expect(translate('auto.components.artifacts.ArtifactsPage.title', 'Artifacts')).toBe('产物')
  })

  it('covers artifact screens and terminology without English fallback or changed placeholders', async () => {
    await setRendererUiLanguage('zh')

    for (const [key, fallback] of Object.entries(english)) {
      const mentionsArtifact = /\bartifacts?\b/i.test(fallback.replace(placeholders, ''))
      if (
        !key.startsWith('auto.components.artifacts.') &&
        !key.startsWith('auto.components.settings.artifacts.') &&
        !mentionsArtifact
      ) {
        continue
      }
      const localized = chinese[key]
      expect(localized, key).toBeTypeOf('string')
      expect(translate(key, fallback), key).toBe(localized)
      expect(localized.match(placeholders) ?? [], key).toEqual(fallback.match(placeholders) ?? [])
      expect(localized, key).not.toMatch(/\bartifacts?\b|工件/i)
      if (mentionsArtifact) {
        expect(localized, key).toContain('产物')
      }
    }
  })

  it('preserves the artifact URL placeholder used by repository hooks', async () => {
    await setRendererUiLanguage('zh')

    expect(
      translate(
        'auto.components.settings.RepositoryHooksSection.4084720f47',
        'Complete {{artifact_url}}',
        {
          artifact_url: 'https://example.com/artifacts/result'
        }
      )
    ).toBe('完成 https://example.com/artifacts/result')
  })
})
