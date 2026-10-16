import type { WorkspaceStatusDefinition } from '../../../src/shared/worktree/types'
import { translate } from '../../../src/renderer/src/i18n/i18n'

/** Translate default workspace status labels to the active UI locale. */
export function translateWorkspaceStatusLabel(status: WorkspaceStatusDefinition): string {
  switch (status.id) {
    case 'todo':
      return translate('auto.components.sidebar.workspaceBoardStatus.todo', 'Todo')
    case 'in-progress':
      return translate('auto.components.sidebar.workspaceBoardStatus.inProgress', 'In progress')
    case 'in-review':
      return translate('auto.components.sidebar.workspaceBoardStatus.inReview', 'In review')
    case 'completed':
      return translate('auto.components.sidebar.workspaceBoardStatus.done', 'Done')
    default:
      return status.label
  }
}
