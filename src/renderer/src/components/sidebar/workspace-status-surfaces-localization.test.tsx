import { afterEach, describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { i18n, translate } from '@/i18n/i18n'
import { ReviewChecksBadge } from './WorktreeCardMetadataStatusBadges'
import { translateWorkspaceBoardStatusLabel } from './workspace-board-status-label'

afterEach(async () => {
  await i18n.changeLanguage('en')
})

describe('workspace status surface localization', () => {
  it('localizes default board states, dashboard state, and failed checks', async () => {
    await i18n.changeLanguage('zh')

    expect(
      ['todo', 'in-progress', 'in-review', 'completed'].map((id) =>
        translateWorkspaceBoardStatusLabel({ id, label: '' })
      )
    ).toEqual(['待办', '进行中', '评审中', '完成'])
    expect(translate('dashboardPopout.bucket.working', 'Working')).toBe('工作中')
    expect(renderToStaticMarkup(<ReviewChecksBadge status="failure" />)).toContain('检查失败')
  })
})
