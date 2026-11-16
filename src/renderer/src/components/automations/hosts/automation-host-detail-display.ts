// Use the catalog row’s storage host: a record’s local target means local to its server. Fall back to that target only for uncaptured legacy rows.

import type { Automation } from '../../../../../shared/automations/automation-definition'
import { getExecutionHostLabel, toSshExecutionHostId } from '../../../../../shared/execution-host'
import { translateExecutionHostLabel } from '@/components/sidebar/execution-host-label'
import { translate } from '@/i18n/i18n'
import type { Translate } from '@/i18n/use-translate'
import type { AutomationHostCatalogEntry } from './automation-host-catalog-types'

export type AutomationHostDetailDisplay = {
  label: string
  /** Authority-qualified when the two differ; a self host is its own authority. */
  title: string
}

export function getAutomationHostDetailDisplay(
  input: {
    automation: Pick<Automation, 'executionTargetType' | 'executionTargetId'>
    entry?: AutomationHostCatalogEntry | null
    hostLabelById?: ReadonlyMap<string, string>
  },
  t: Translate = translate
): AutomationHostDetailDisplay {
  const { automation, entry, hostLabelById } = input
  if (entry) {
    const label = translateExecutionHostLabel(entry.label, t)
    return {
      label,
      title:
        entry.authorityLabel === entry.label
          ? label
          : `${translateExecutionHostLabel(entry.authorityLabel, t)} · ${label}`
    }
  }
  const hostId =
    automation.executionTargetType === 'ssh'
      ? toSshExecutionHostId(automation.executionTargetId)
      : 'local'
  const label = translateExecutionHostLabel(
    hostLabelById?.get(hostId) ?? getExecutionHostLabel(hostId),
    t
  )
  return { label, title: label }
}
