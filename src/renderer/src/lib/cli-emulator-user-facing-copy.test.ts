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

  it('localizes CLI timeout errors in Chinese', async () => {
    await setRendererUiLanguage('zh')

    expect(
      formatCliUserFacingDetail(
        "Error invoking remote method 'cli:getWslInstallStatus': Error: WSL command timed out after 10000ms."
      )
    ).toBe('WSL 命令在 10000 毫秒后超时')
    expect(formatCliUserFacingDetail('Windows PATH command timed out after 5000ms.')).toBe(
      'Windows PATH 命令在 5000 毫秒后超时'
    )
  })

  it.each([
    ['CLI registration is unavailable on this build.', '此构建版本不支持 CLI 注册'],
    ['WSL CLI registration is unavailable.', 'WSL CLI 注册不可用'],
    ['WSL CLI registration is only available on Windows.', 'WSL CLI 注册仅适用于 Windows'],
    ['No WSL distribution is available.', '没有可用的 WSL 发行版'],
    ['The Windows Orca CLI launcher is missing.', '缺少 Windows 版 Orca CLI 启动器'],
    ['Unable to resolve the WSL home directory.', '无法解析 WSL 主目录'],
    [
      'WSL Windows interop is unavailable; Orca cannot launch the Windows CLI from WSL.',
      'WSL 的 Windows 互操作功能不可用，Orca 无法从 WSL 启动 Windows CLI'
    ],
    [
      'The Orca launcher exists, but Orca could not check your Windows user PATH.',
      'Orca 启动器已存在，但 Orca 无法检查你的 Windows 用户 PATH'
    ],
    ['Registered at C:\\Orca\\orca.exe.', '已注册到 C:\\Orca\\orca.exe'],
    [
      'Registered in Ubuntu at /home/me/.local/bin/orca-ide.',
      '已在 Ubuntu 中注册到 /home/me/.local/bin/orca-ide'
    ],
    [
      '/usr/local/bin/orca exists but is not an Orca launcher script.',
      '/usr/local/bin/orca 已存在，但不是 Orca 启动器脚本'
    ],
    [
      '/usr/local/bin/orca exists but is not an Orca symlink.',
      '/usr/local/bin/orca 已存在，但不是 Orca 符号链接'
    ],
    ['/usr/local/bin/orca points to a different launcher.', '/usr/local/bin/orca 指向其他启动器'],
    [
      '/usr/local/bin/orca contains an older Orca launcher.',
      '/usr/local/bin/orca 包含旧版 Orca 启动器'
    ]
  ])('localizes known CLI detail %s in Chinese', async (raw, expected) => {
    await setRendererUiLanguage('zh')

    expect(formatCliUserFacingDetail(raw)).toBe(expected)
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
