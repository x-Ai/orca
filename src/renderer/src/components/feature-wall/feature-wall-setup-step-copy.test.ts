import { afterEach, describe, expect, it } from 'vitest'
import { FEATURE_WALL_SETUP_STEPS } from '../../../../shared/feature-wall-setup-steps'
import { setRendererUiLanguage } from '@/i18n/i18n'
import { localizeFeatureWallSetupStep } from './feature-wall-setup-step-copy'

afterEach(async () => {
  await setRendererUiLanguage('en')
})

describe('feature wall setup step localization', () => {
  it('localizes every setup explanation in Chinese', async () => {
    await setRendererUiLanguage('zh')

    const localized = FEATURE_WALL_SETUP_STEPS.map(localizeFeatureWallSetupStep)

    expect(localized.map((step) => step.name)).toEqual([
      '并行处理多项任务',
      '使用 Orca 浏览器',
      '开启通知',
      '选择默认代理',
      '启用 Orca CLI',
      '连接集成',
      '自动完成工作区准备',
      '在多个仓库中开始工作'
    ])
    expect(localized.every((step) => /[\u3400-\u9fff]/u.test(step.description))).toBe(true)
  })
})
