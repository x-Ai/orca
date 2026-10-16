import { useAppStore } from '@/store'
import { formatSshErrorOrFallback } from '@/components/settings/ssh-user-facing-error'
import { sshConnectFailureText } from './ssh-host-server-status-copy'

/** Upstream's connect-failure toast text, with main's known SSH errors translated first. */
export function localizedSshTargetConnectFailureText(
  targetId: string,
  error: unknown,
  fallback: string
): string {
  return sshConnectFailureText(
    useAppStore.getState().sshConnectionStates.get(targetId),
    formatSshErrorOrFallback(error, fallback)
  )
}
