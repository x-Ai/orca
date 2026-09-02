import { afterEach, describe, expect, it } from 'vitest'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { formatBrowserCookieImportFailure } from './browser-cookie-import-failure'

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('formatBrowserCookieImportFailure', () => {
  it.each([
    [
      'Could not copy Microsoft Edge cookies database. Try closing Microsoft Edge first.',
      '无法复制 Microsoft Edge Cookie 数据库。请先关闭 Microsoft Edge 后重试。'
    ],
    [
      'Target cookie database not found. Open a browser tab first.',
      '找不到目标 Cookie 数据库。请先打开一个浏览器标签页。'
    ],
    [
      'No cookies database found for profile "Profile 2".',
      '找不到配置文件“Profile 2”的 Cookie 数据库。'
    ],
    ['No valid cookies found in Firefox.', '在 Firefox 中未找到有效 Cookie。'],
    [
      'No valid cookies found. 3 entries were skipped due to missing or invalid fields.',
      '未找到有效 Cookie。由于字段缺失或无效，已跳过 3 个条目。'
    ],
    [
      'The connection to this server ended during the import. Reconnect and try again.',
      '导入期间与此服务器的连接已中断。请重新连接后重试。'
    ]
  ])('localizes %s', async (reason, expected) => {
    await setRendererUiLanguage('zh')

    expect(formatBrowserCookieImportFailure(reason)).toBe(expected)
  })

  it('localizes diagnostic framing while retaining the path', async () => {
    await setRendererUiLanguage('zh')

    expect(
      formatBrowserCookieImportFailure(
        'Could not replace existing cookies for the imported sites. Details were written to C:\\Temp\\orca-cookie-import-diag.log.'
      )
    ).toBe(
      '无法替换已导入站点的现有 Cookie。详细信息已写入 C:\\Temp\\orca-cookie-import-diag.log。'
    )
  })

  it('preserves an unknown newer-host reason', async () => {
    await setRendererUiLanguage('zh')

    expect(formatBrowserCookieImportFailure('A newer host reported a new failure.')).toBe(
      'A newer host reported a new failure.'
    )
  })
})
