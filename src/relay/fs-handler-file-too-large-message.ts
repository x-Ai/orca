import { translateMain } from '../main/i18n/main-i18n'

/** Localized refusal for a relay file read over the preview size limit. */
export function relayFileTooLargeMessage(size: number, sizeLimit: number): string {
  const actualSize = (size / 1024 / 1024).toFixed(1)
  const maxSize = sizeLimit / 1024 / 1024
  return translateMain(
    'auto.relay.fsHandler.fileTooLarge',
    `File too large: ${actualSize}MB exceeds ${maxSize}MB limit`,
    { actualSize, maxSize }
  )
}
