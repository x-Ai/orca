import { translate } from '@/i18n/i18n'

/** Localize stable CLI error framing while preserving the diagnostic command and details. */
export function formatTaskSourceErrorMessage(raw: string): string {
  return raw
    .replace(
      /^Invalid request\b/,
      translate('auto.lib.taskSourceError.invalidRequest', 'Invalid request')
    )
    .replace(
      /\bCommand failed:/,
      translate('auto.lib.taskSourceError.commandFailed', 'Command failed:')
    )
    .replace(
      /\bValidation Failed\b/g,
      translate('auto.lib.taskSourceError.validationFailed', 'Validation Failed')
    )
}
