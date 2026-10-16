import i18next, { type i18n as I18nInstance, type TOptions } from 'i18next'
import { isPseudoLocalizationLocale, pseudoLocalizeString } from '../../shared/pseudo-localization'
import { DEFAULT_UI_LOCALE } from '../../shared/ui-locale'

// Why: the i18next instance, the active-locale accessor, and translateMain live here, apart from
// the lazy locale-catalog loaders in main-i18n.ts. Server-reachable code (computer-use RPC,
// runtime notifications) only needs these, so importing them must not drag the renderer locale
// JSON into the orcad bundle — node-server-change-scope asserts no src/renderer file enters it.
export const mainI18n: I18nInstance = i18next.createInstance()

export function getMainUiLocale(): string {
  return mainI18n.isInitialized ? mainI18n.resolvedLanguage || mainI18n.language : DEFAULT_UI_LOCALE
}

export function translateMain(key: string, fallback: string, options?: TOptions): string {
  // Why: menu registration can run before async init finishes in tests; fall back
  // to the English default instead of returning undefined from an uninitialized i18n.
  const raw = mainI18n.isInitialized
    ? mainI18n.t(key, { defaultValue: fallback, ...options })
    : fallback
  const value = typeof raw === 'string' && raw.length > 0 ? raw : fallback
  return isPseudoLocalizationLocale(mainI18n.language) ? pseudoLocalizeString(value) : value
}
