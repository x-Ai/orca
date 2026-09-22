import { translate } from '@/i18n/i18n'
import type { ExecutionHostHealth } from '../../../shared/execution-host-registry'
import type { SshConnectionStatus } from '../../../shared/ssh-types'

type Availability = {
  status?: SshConnectionStatus
  health?: ExecutionHostHealth
  reason?:
    | 'checking-task-source-capability'
    | 'missing-task-source-capability'
    | 'missing-provider-auth'
    | 'unavailable-source-tool'
    | 'unsupported-provider'
}

export function getTaskSourceAvailabilityStatusLabel(availability: Availability): string | null {
  switch (availability.reason) {
    case undefined:
      break
    case 'checking-task-source-capability':
      return translate(
        'auto.components.taskSourceContextSummary.checkingServerCapabilities',
        'checking server capabilities'
      )
    case 'missing-task-source-capability':
      return translate(
        'auto.components.taskSourceContextSummary.taskSourceServerUpdateNeeded',
        'server update needed for task sources'
      )
    case 'missing-provider-auth':
      return translate(
        'auto.components.taskSourceContextSummary.providerAuthNeeded',
        'provider auth needed'
      )
    case 'unavailable-source-tool':
      return translate(
        'auto.components.taskSourceContextSummary.sourceToolUnavailable',
        'source tool unavailable'
      )
    case 'unsupported-provider':
      return translate(
        'auto.components.taskSourceContextSummary.providerUnsupported',
        'provider unsupported on this host'
      )
  }
  if (availability.status) {
    return availability.status === 'connected' ? null : getSshStatusLabel(availability.status)
  }
  switch (availability.health) {
    case 'local':
    case 'available':
    case undefined:
      return null
    case 'connecting':
      return translate('auto.components.taskSourceContextSummary.connecting', 'connecting')
    case 'blocked':
      return translate(
        'auto.components.taskSourceContextSummary.serverUpdateNeeded',
        'server update needed'
      )
    case 'disconnected':
      return translate('auto.components.taskSourceContextSummary.disconnected', 'disconnected')
    case 'error':
      return translate(
        'auto.components.taskSourceContextSummary.connectionIssue',
        'connection issue'
      )
  }
}

export function getTaskSourceAvailabilityLabel(
  unavailableHosts: readonly { statusLabel: string }[]
): string | null {
  if (unavailableHosts.length === 0) {
    return null
  }
  if (unavailableHosts.length === 1) {
    return unavailableHosts[0].statusLabel
  }
  return translate(
    'auto.components.taskSourceContextSummary.unavailableCount',
    '{{value0}} unavailable',
    { value0: unavailableHosts.length }
  )
}

function getSshStatusLabel(status: SshConnectionStatus): string {
  switch (status) {
    case 'connected':
      return translate('auto.components.taskSourceContextSummary.connected', 'connected')
    case 'connecting':
    case 'deploying-relay':
    case 'reconnecting':
      return translate('auto.components.taskSourceContextSummary.connecting', 'connecting')
    case 'auth-failed':
      return translate('auto.components.taskSourceContextSummary.authNeeded', 'auth needed')
    case 'reconnection-failed':
    case 'error':
      return translate(
        'auto.components.taskSourceContextSummary.connectionIssue',
        'connection issue'
      )
    case 'disconnected':
      return translate('auto.components.taskSourceContextSummary.disconnected', 'disconnected')
  }
}
