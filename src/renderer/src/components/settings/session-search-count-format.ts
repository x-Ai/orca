import { getIntlLocale } from '@/i18n/i18n'

/**
 * Counts for the session-search status sentences.
 *
 * Sessions keep their grouping separators because a user recognises their own
 * transcript count; messages run to millions, where the exact figure carries
 * nothing the compact form does not.
 */
export function formatSessionCount(sessions: number): string {
  return new Intl.NumberFormat(getIntlLocale(), { useGrouping: true }).format(
    Math.max(0, Math.trunc(sessions))
  )
}

export function formatMessageCount(messages: number): string {
  return new Intl.NumberFormat(getIntlLocale(), {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(Math.max(0, Math.trunc(messages)))
}
