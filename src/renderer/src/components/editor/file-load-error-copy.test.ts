import { afterEach, describe, expect, it } from 'vitest'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { formatFileLoadErrorMessage } from './file-load-error-copy'

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('formatFileLoadErrorMessage', () => {
  it.each(["'C:\\项目\\missing file.md'", "'/home/user/missing.md'"])(
    'localizes missing files while preserving the path %s',
    async (path) => {
      await setRendererUiLanguage('zh')
      const message = `ENOENT: no such file or directory, open ${path}`
      const expected = `ENOENT：无法打开 ${path}，文件或目录不存在`
      expect(formatFileLoadErrorMessage(message)).toBe(expected)
      expect(
        formatFileLoadErrorMessage(`Error invoking remote method 'fs:readFile': Error: ${message}`)
      ).toBe(expected)
    }
  )

  it('preserves English and unrelated errors', async () => {
    const message = "ENOENT: no such file or directory, open '/missing.md'"
    expect(formatFileLoadErrorMessage(message)).toBe(message)
    await setRendererUiLanguage('zh')
    const denied = "EACCES: permission denied, open '/private.md'"
    expect(formatFileLoadErrorMessage(denied)).toBe(denied)
  })
})
