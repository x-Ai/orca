import { afterEach, describe, expect, it } from 'vitest'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { formatSshUserFacingError } from './ssh-user-facing-error'

const PASSPHRASE_REQUIRED_ERROR =
  'Cannot parse privateKey: Encrypted private OpenSSH key detected, but no passphrase given'

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('formatSshUserFacingError', () => {
  it('localizes an encrypted private key without a passphrase', async () => {
    await setRendererUiLanguage('zh')

    expect(formatSshUserFacingError(PASSPHRASE_REQUIRED_ERROR)).toBe(
      '无法解析私钥：检测到加密的 OpenSSH 私钥，但未提供口令'
    )
  })
})
