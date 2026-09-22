// @vitest-environment happy-dom

import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { WslCliRegistration } from './WslCliRegistration'

const toastError = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
  toast: { error: toastError, success: vi.fn() }
}))

vi.mock('@/lib/windows-terminal-capabilities', () => ({
  useWindowsTerminalCapabilities: () => ({ wslAvailable: true })
}))

afterEach(async () => {
  cleanup()
  toastError.mockReset()
  Reflect.deleteProperty(window, 'api')
  await setRendererUiLanguage('en')
})

describe('WslCliRegistration', () => {
  it('localizes an unreachable WSL distro status error', async () => {
    await setRendererUiLanguage('zh')
    Object.defineProperty(window, 'api', {
      configurable: true,
      value: {
        cli: {
          getWslInstallStatus: vi
            .fn()
            .mockRejectedValue(
              new Error(
                "Error invoking remote method 'cli:getWslInstallStatus': Error: Could not reach the WSL distro. Try again."
              )
            )
        }
      }
    })

    render(<WslCliRegistration currentPlatform="win32" />)

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('无法连接到 WSL 发行版，请重试。')
    })
  })
})
