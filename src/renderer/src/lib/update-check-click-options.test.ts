import { afterEach, describe, expect, it } from 'vitest'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { getUpdateCheckClickOptions, getUpdateCheckHint } from './update-check-click-options'

function clickEvent(
  overrides: Partial<Pick<MouseEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>>
) {
  return {
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    ...overrides
  }
}

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('getUpdateCheckClickOptions', () => {
  it('uses Cmd on macOS for perf prerelease checks', () => {
    expect(getUpdateCheckClickOptions(clickEvent({ metaKey: true }), true)).toEqual({
      includePrerelease: false,
      includePerfPrerelease: true
    })
    expect(getUpdateCheckClickOptions(clickEvent({ ctrlKey: true }), true)).toEqual({
      includePrerelease: false,
      includePerfPrerelease: false
    })
  })

  it('uses Ctrl outside macOS for perf prerelease checks', () => {
    expect(getUpdateCheckClickOptions(clickEvent({ ctrlKey: true }), false)).toEqual({
      includePrerelease: false,
      includePerfPrerelease: true
    })
    expect(getUpdateCheckClickOptions(clickEvent({ metaKey: true }), false)).toEqual({
      includePrerelease: false,
      includePerfPrerelease: false
    })
  })

  it('keeps Shift as the RC prerelease modifier', () => {
    expect(
      getUpdateCheckClickOptions(clickEvent({ shiftKey: true, ctrlKey: true }), false)
    ).toEqual({
      includePrerelease: true,
      includePerfPrerelease: true
    })
  })

  it('gives local build selection precedence over release channel modifiers', () => {
    expect(
      getUpdateCheckClickOptions(clickEvent({ altKey: true, shiftKey: true, metaKey: true }), true)
    ).toEqual({ localBuild: true })
    expect(getUpdateCheckClickOptions(clickEvent({ altKey: true }), false)).toEqual({
      includePrerelease: false,
      includePerfPrerelease: false
    })
  })

  it('formats the tooltip hint by platform', () => {
    expect(getUpdateCheckHint(true)).toBe(
      '⇧+click checks the latest RC; ⌘+click checks the latest perf build. ⌥+click chooses a local macOS build.'
    )
    expect(getUpdateCheckHint(false)).toBe(
      'Shift+click checks the latest RC; Ctrl+click checks the latest perf build.'
    )
  })

  it('localizes the hint while preserving each platform modifier', async () => {
    await setRendererUiLanguage('zh')
    expect(getUpdateCheckHint(false)).toBe(
      'Shift+ 点击检查最新候选发布版(RC)，Ctrl+ 点击检查最新性能测试构建'
    )
    expect(getUpdateCheckHint(true)).toBe(
      '⇧+ 点击检查最新候选发布版(RC)，⌘+ 点击检查最新性能测试构建 ⌥+点击选择本地 macOS 构建'
    )
    await setRendererUiLanguage('en')
    expect(getUpdateCheckHint(false)).toBe(
      'Shift+click checks the latest RC; Ctrl+click checks the latest perf build.'
    )
  })
})
