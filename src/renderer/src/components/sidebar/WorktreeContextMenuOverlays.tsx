import { ProjectGroupNameDialog } from './ProjectGroupNameDialog'
import { WorktreeParentPickerPopover } from './WorktreeParentPickerPopover'
import { useTranslation } from 'react-i18next'
import { translate } from '@/i18n/i18n'
import { getRepoHostIdentity } from '@/store/slices/repo-host-identity'
import type { WorktreeContextMenuModel } from './use-worktree-context-menu-model'

type WorktreeContextMenuOverlayModel = Pick<
  WorktreeContextMenuModel,
  | 'repo'
  | 'createGroupDialogOpen'
  | 'handleCreateGroupDialogOpenChange'
  | 'handleSubmitNewProjectGroup'
  | 'parentPicker'
  | 'parentPickerOpen'
  | 'handleParentPickerOpenChange'
>

export function WorktreeContextMenuOverlays({ model }: { model: WorktreeContextMenuOverlayModel }) {
  useTranslation()
  return (
    <>
      <ProjectGroupNameDialog
        key={model.repo ? getRepoHostIdentity(model.repo) : 'no-repo'}
        open={model.createGroupDialogOpen}
        title={translate(
          'auto.components.sidebar.WorktreeContextMenu.6664418e98',
          'New Project Group'
        )}
        description={translate(
          'auto.components.sidebar.WorktreeContextMenu.c39c37676a',
          'Create a group and move this project into it.'
        )}
        initialName={
          model.repo
            ? translate(
                'auto.components.sidebar.ProjectGroupNameDialog.defaultName',
                '{{name}} group',
                { name: model.repo.displayName }
              )
            : ''
        }
        confirmLabel={translate('auto.components.sidebar.ProjectGroupNameDialog.create', 'Create')}
        onOpenChange={model.handleCreateGroupDialogOpenChange}
        onSubmit={model.handleSubmitNewProjectGroup}
      />
      {model.parentPicker ? (
        <WorktreeParentPickerPopover
          open={model.parentPickerOpen}
          childWorktreeId={model.parentPicker.childWorktreeId}
          anchorElement={model.parentPicker.anchorElement}
          onOpenChange={model.handleParentPickerOpenChange}
        />
      ) : null}
    </>
  )
}
