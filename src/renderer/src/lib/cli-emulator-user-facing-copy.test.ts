import { afterEach, describe, expect, it } from 'vitest'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { formatCliUserFacingDetail } from './cli-emulator-user-facing-copy'

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('formatCliUserFacingDetail', () => {
  it('localizes WSL timeouts wrapped in Electron invoke errors', () => {
    expect(
      formatCliUserFacingDetail(
        "Error invoking remote method 'cli:getWslInstallStatus': Error: WSL command timed out after 10000ms."
      )
    ).toBe('WSL command timed out after 10000ms.')
  })

  it('localizes an unreachable WSL distro wrapped in an Electron invoke error', async () => {
    await setRendererUiLanguage('zh')

    expect(
      formatCliUserFacingDetail(
        "Error invoking remote method 'cli:getWslInstallStatus': Error: Could not reach the WSL distro. Try again."
      )
    ).toBe('无法连接到 WSL 发行版，请重试。')
  })

  it('localizes Windows shell registration details including a blank path', () => {
    expect(
      formatCliUserFacingDetail(
        'Register C:\\Orca\\resources\\bin\\orca.exe to use Orca from Command Prompt or PowerShell.'
      )
    ).toBe(
      'Register C:\\Orca\\resources\\bin\\orca.exe to use Orca from Command Prompt or PowerShell.'
    )
    expect(
      formatCliUserFacingDetail('Register  to use Orca from Command Prompt or PowerShell.')
    ).toBe('Register orca to use Orca from Command Prompt or PowerShell.')
  })

  it('localizes WSL registration details including a blank path', () => {
    expect(formatCliUserFacingDetail('Register ~/.local/bin/orca-ide to use Orca from WSL.')).toBe(
      'Register ~/.local/bin/orca-ide to use Orca from WSL.'
    )
    expect(formatCliUserFacingDetail('Register  to use Orca from WSL.')).toBe(
      'Register orca to use Orca from WSL.'
    )
  })
})
