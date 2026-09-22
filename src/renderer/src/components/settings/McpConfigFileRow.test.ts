import { afterEach, describe, expect, it } from 'vitest'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { mcpConfigCandidateLabel, mcpServerCountLabel } from './McpConfigFileRow'

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('MCP config row localization', () => {
  it('localizes workspace config labels and server counts without an English suffix', async () => {
    await setRendererUiLanguage('zh')

    expect(
      mcpConfigCandidateLabel({
        format: 'workspace',
        label: 'Workspace',
        relativePath: '.mcp.json',
        serversPath: ['mcpServers']
      })
    ).toBe('工作区')
    expect(mcpServerCountLabel(0)).toBe('0 个服务器')
    expect(mcpServerCountLabel(1)).toBe('1 个服务器')
  })
})
