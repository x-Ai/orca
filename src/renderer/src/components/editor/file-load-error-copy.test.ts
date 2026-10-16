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

  it('localizes the remote paged-read failures', async () => {
    await setRendererUiLanguage('zh')
    expect(formatFileLoadErrorMessage('Remote path is a directory')).toBe('远程路径是一个目录')
    expect(
      formatFileLoadErrorMessage(
        'Remote file is larger than the 512 KB this Orca server can send. Update the server to open it.'
      )
    ).toBe('远程文件超过了此 Orca 服务器可发送的 512 KB 上限，请更新服务器后再打开')
    expect(
      formatFileLoadErrorMessage(
        "Error invoking remote method 'fs:readFile': Error: Remote file is too large to open in the editor (62914560 bytes)"
      )
    ).toBe('远程文件过大，无法在编辑器中打开（62914560 字节）')
  })

  it('preserves English and unrelated errors', async () => {
    const message = "ENOENT: no such file or directory, open '/missing.md'"
    expect(formatFileLoadErrorMessage(message)).toBe(message)
    await setRendererUiLanguage('zh')
    const denied = "EACCES: permission denied, open '/private.md'"
    expect(formatFileLoadErrorMessage(denied)).toBe(denied)
  })
})
