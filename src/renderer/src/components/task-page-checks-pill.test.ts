import { afterEach, describe, expect, it } from 'vitest'
import { getChecksLabel, getChecksPillTone } from './task-page-checks-pill'
import { setRendererUiLanguage } from '@/i18n/i18n'

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('task page checks pill', () => {
  // Why: the pill's tone reads `state`, so a label branch keyed off `neutral > 0` painted a green
  // pill that said "1 unresolved" for a PR the same summary called successful.
  it('labels a green summary carrying one neutral check as passing', () => {
    const item = {
      checksSummary: {
        state: 'success' as const,
        total: 2,
        passed: 1,
        failed: 0,
        pending: 0,
        neutral: 1
      }
    }

    expect(getChecksLabel(item)).toBe('1 of 2 checks passing')
    expect(getChecksPillTone(item)).toContain('emerald')
  })

  it('only says unresolved when nothing passed, failed or is running', () => {
    const item = {
      checksSummary: {
        state: 'neutral' as const,
        total: 1,
        passed: 0,
        failed: 0,
        pending: 0,
        neutral: 1
      }
    }

    expect(getChecksLabel(item)).toBe('1 unresolved')
    expect(getChecksPillTone(item)).toContain('text-muted-foreground')
  })

  it('falls back while the summary is unknown or empty', () => {
    expect(getChecksLabel({})).toBe('Checks')
    expect(
      getChecksLabel({
        checksSummary: {
          state: 'none',
          total: 0,
          passed: 0,
          failed: 0,
          pending: 0,
          neutral: 0
        }
      })
    ).toBe('No checks found')
  })

  it('localizes failure, pending, empty, and passing summaries', async () => {
    await setRendererUiLanguage('zh')

    expect(
      getChecksLabel({
        checksSummary: {
          state: 'failure',
          total: 3,
          passed: 0,
          failed: 3,
          pending: 0,
          neutral: 0
        }
      })
    ).toBe('3 失败')
    expect(
      getChecksLabel({
        checksSummary: {
          state: 'pending',
          total: 14,
          passed: 0,
          failed: 0,
          pending: 14,
          neutral: 0
        }
      })
    ).toBe('14 待处理')
    expect(
      getChecksLabel({
        checksSummary: {
          state: 'success',
          total: 11,
          passed: 11,
          failed: 0,
          pending: 0,
          neutral: 0
        }
      })
    ).toBe('11/11 个检查通过')
  })
})
