import type { ProviderCheckSummary } from '../../../shared/github/pull-request-types'
import { translate } from '@/i18n/i18n'

type ChecksPillItem = { checksSummary?: ProviderCheckSummary }

/**
 * The Tasks-grid checks pill. Label and tone both read the one shared summary so the pill can never
 * contradict its own colour — a green pill used to read "1 unresolved" whenever neutral > 0.
 */
export function getChecksLabel(item: ChecksPillItem): string {
  const summary = item.checksSummary
  if (!summary) {
    return translate('auto.components.TaskPage.a7396b05c6', 'Checks')
  }
  if (summary.total === 0) {
    return translate('auto.components.pr-check-counts.noChecks', 'No checks found')
  }
  if (summary.failed > 0) {
    return translate('auto.components.pr-check-counts.failingChip', '{{value0}} failing', {
      value0: summary.failed
    })
  }
  if (summary.pending > 0) {
    return translate('auto.components.pr-check-counts.pendingChip', '{{value0}} pending', {
      value0: summary.pending
    })
  }
  if (summary.state === 'neutral') {
    return translate('auto.components.pr-check-counts.unresolvedChip', '{{value0}} unresolved', {
      value0: summary.neutral || summary.total
    })
  }
  return translate(
    'auto.components.pr-check-counts.passingSummary',
    '{{value0}} of {{value1}} checks passing',
    { value0: summary.passed, value1: summary.total }
  )
}

export function getChecksPillTone(item: ChecksPillItem): string {
  const state = item.checksSummary?.state
  if (state === 'success') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
  }
  if (state === 'failure') {
    return 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-200'
  }
  if (state === 'pending') {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200'
  }
  return 'border-border/60 bg-background/70 text-muted-foreground'
}
