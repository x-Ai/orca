import { afterEach, describe, expect, it } from 'vitest'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { translateWorkspaceStatusHeaderLabel } from './workspace-board-status-label'

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('translateWorkspaceStatusHeaderLabel', () => {
  it('localizes a shipped default status lane header', async () => {
    await setRendererUiLanguage('zh')
    expect(translateWorkspaceStatusHeaderLabel('in-progress', 'In progress')).toBe('进行中')
  })

  it('keeps a renamed status and non-status headers as emitted', async () => {
    await setRendererUiLanguage('zh')
    expect(translateWorkspaceStatusHeaderLabel('in-progress', 'Shipping')).toBe('Shipping')
    expect(translateWorkspaceStatusHeaderLabel(null, 'In progress')).toBe('In progress')
  })
})
