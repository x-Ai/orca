import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { handleMock, showOpenDialogMock } = vi.hoisted(() => ({
  handleMock: vi.fn(),
  showOpenDialogMock: vi.fn()
}))

vi.mock('electron', () => ({
  app: { getLocale: () => 'en-US' },
  ipcMain: { handle: handleMock },
  shell: { showItemInFolder: vi.fn(), openExternal: vi.fn(), openPath: vi.fn() },
  dialog: { showOpenDialog: showOpenDialogMock }
}))

import { registerShellHandlers } from './shell'
import { setMainUiLanguage } from '../i18n/main-i18n'

// Why: the native file dialog's filter name is main-process copy, so it follows the UI language.
describe('shell:pickAudio dialog filter localization', () => {
  beforeEach(() => {
    handleMock.mockReset()
    showOpenDialogMock.mockReset()
  })

  afterEach(async () => {
    await setMainUiLanguage('en')
  })

  it.each([
    ['en', 'Audio'],
    ['zh', '音频']
  ] as const)('names the audio filter in the %s UI language', async (language, filterName) => {
    showOpenDialogMock.mockResolvedValue({ canceled: false, filePaths: ['/tmp/pling.ogg'] })
    registerShellHandlers({
      getSettings: () => ({ activeRuntimeEnvironmentId: null }),
      getSshTarget: () => undefined
    } as never)
    const call = handleMock.mock.calls.find((c: unknown[]) => c[0] === 'shell:pickAudio')
    if (!call) {
      throw new Error('shell:pickAudio handler not registered')
    }
    const handler = call[1] as (event: unknown) => Promise<unknown>
    await setMainUiLanguage(language)
    await expect(handler({})).resolves.toBe('/tmp/pling.ogg')
    expect(showOpenDialogMock).toHaveBeenCalledWith({
      properties: ['openFile'],
      filters: [{ name: filterName, extensions: ['ogg', 'mp3', 'wav', 'm4a', 'aac', 'flac'] }]
    })
  })
})
