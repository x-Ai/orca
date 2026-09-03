import { translate } from '@/i18n/i18n'
import type { ProjectOptionSection } from './project-combobox-matching'

export function translateProjectOptionSectionHeading(
  section: Pick<ProjectOptionSection, 'key' | 'heading'>
): string | null {
  switch (section.key) {
    case 'recent':
      return translate('auto.components.new.workspace.ProjectCombobox.recentSection', 'Recent')
    case 'projects':
      return translate('auto.components.new.workspace.ProjectCombobox.projectsSection', 'Projects')
    case 'folders':
      return translate('auto.components.new.workspace.ProjectCombobox.foldersSection', 'Folders')
    default:
      return section.heading
  }
}

export function translateProjectOptionDetail(detail: string): string {
  return detail === 'Project'
    ? translate('auto.components.new.workspace.ProjectCombobox.projectDetail', 'Project')
    : detail
}
