import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

const showOpenDialogMock = vi.hoisted(() => vi.fn())

vi.mock('electron', () => ({
  app: { getLocale: () => 'en-US' },
  BrowserWindow: {},
  dialog: { showOpenDialog: showOpenDialogMock }
}))

import {
  chooseManualWarpThemeFiles,
  chooseManualWarpThemeFolderPath,
  createManualWarpThemeFileCandidates
} from './manual-warp-theme-files'
import { setMainUiLanguage } from '../i18n/main-i18n'

afterEach(async () => {
  showOpenDialogMock.mockReset()
  await setMainUiLanguage('en')
})

describe('manual theme native dialog localization', () => {
  it.each([
    ['en', 'Import Warp Theme', 'Import Warp Theme Folder', 'Warp theme YAML'],
    ['zh', '导入 Warp 主题', '导入 Warp 主题文件夹', 'Warp 主题 YAML']
  ] as const)(
    'uses the %s locale without changing file selections',
    async (language, fileTitle, folderTitle, filterName) => {
      await setMainUiLanguage(language)
      showOpenDialogMock.mockResolvedValue({ canceled: true, filePaths: [] })

      await expect(chooseManualWarpThemeFiles()).resolves.toEqual({ canceled: true })
      expect(showOpenDialogMock).toHaveBeenLastCalledWith({
        title: fileTitle,
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: filterName, extensions: ['yaml', 'yml'] }]
      })

      await expect(chooseManualWarpThemeFolderPath()).resolves.toBeNull()
      expect(showOpenDialogMock).toHaveBeenLastCalledWith({
        title: folderTitle,
        properties: ['openDirectory']
      })
    }
  )
})

describe('manual theme ordering', () => {
  it('reuses one collator for labels and path ties without changing the selected order', () => {
    const names = ['éclair', 'Eclair', 'item2', 'item10', 'Ångström', 'zebra', 'İstanbul']
    const paths = Array.from({ length: 200 }, (_, index) =>
      path.join('themes', names[index % names.length]!, `${names[(index * 3) % names.length]}.yaml`)
    )
    const expected = [...paths].sort(
      (a, b) =>
        // oxlint-disable-next-line sort-comparator-performance/no-repeated-collator -- Preserve the old comparator as the parity oracle.
        path.basename(a).localeCompare(path.basename(b), undefined, { sensitivity: 'base' }) ||
        // oxlint-disable-next-line sort-comparator-performance/no-repeated-collator -- Preserve the old comparator as the parity oracle.
        a.localeCompare(b, undefined, { sensitivity: 'base' })
    )
    const NativeCollator = Intl.Collator
    const construct = vi.spyOn(Intl, 'Collator').mockImplementation(function (locales, options) {
      return new NativeCollator(locales, options)
    })
    const localeCompare = vi.spyOn(String.prototype, 'localeCompare')
    try {
      expect(createManualWarpThemeFileCandidates(paths).map((file) => file.path)).toEqual(expected)
      expect(construct).toHaveBeenCalledExactlyOnceWith(undefined, { sensitivity: 'base' })
      expect(localeCompare).not.toHaveBeenCalled()
    } finally {
      vi.restoreAllMocks()
    }
  })

  it('returns a single dialog selection without collating', () => {
    const construct = vi.spyOn(Intl, 'Collator')
    try {
      expect(createManualWarpThemeFileCandidates([]).map((file) => file.path)).toEqual([])
      expect(createManualWarpThemeFileCandidates(['a/one.yaml']).map((file) => file.path)).toEqual([
        'a/one.yaml'
      ])
      expect(construct).not.toHaveBeenCalled()
    } finally {
      vi.restoreAllMocks()
    }
  })
})
