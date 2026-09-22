// @vitest-environment happy-dom

import React from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setRendererUiLanguage } from '@/i18n/i18n'
import type { Repo } from '../../../../../../shared/repo-types'
import { WorktreeContextMenuOverlays } from '../../WorktreeContextMenuOverlays'
import { SidebarWorktreeListDialogs } from './ProjectGroupDialogs'
import type { ProjectGroupDialogs, ProjectGroupNameDialogState } from './use-project-group-dialogs'

const repo: Repo = {
  id: 'repo-1',
  path: '/projects/CurshFTPGPT',
  displayName: 'CurshFTPGPT',
  badgeColor: '',
  addedAt: 1,
  kind: 'folder'
}

afterEach(async () => {
  cleanup()
  await setRendererUiLanguage('en')
})

function sidebarDialog(nameDialog: ProjectGroupNameDialogState, onSubmit = vi.fn()) {
  const dialogs: ProjectGroupDialogs = {
    nameDialog,
    setNameDialog: vi.fn(),
    deleteDialog: null,
    setDeleteDialog: vi.fn(),
    deleteProjectCount: 0,
    deleteProjectNames: [],
    removeContainedProjects: false,
    handleCreateGroupFromRepo: vi.fn(),
    handleMoveProjectToGroup: vi.fn(),
    handleRemoveProjectFromGroup: vi.fn(),
    handleRenameProjectGroup: vi.fn(),
    handleSubmitProjectGroupName: onSubmit,
    handleDeleteProjectGroup: vi.fn(),
    handleConfirmDeleteProjectGroup: vi.fn()
  }
  return (
    <SidebarWorktreeListDialogs
      dialogs={dialogs}
      repos={[repo]}
      settings={null}
      suppressExternalWorktreeInboxRepoId={null}
      setSuppressExternalWorktreeInboxRepoId={vi.fn()}
      newExternalWorktreeInboxActionState={new Map()}
      onConfirmSuppressExternalWorktreeInbox={vi.fn()}
      onOpenWorktreeVisibility={vi.fn()}
    />
  )
}

function worktreeDialog(onSubmit: (name: string) => Promise<void>) {
  const model: React.ComponentProps<typeof WorktreeContextMenuOverlays>['model'] = {
    repo: { ...repo, kind: 'git' },
    createGroupDialogOpen: true,
    handleCreateGroupDialogOpenChange: vi.fn(),
    handleSubmitNewProjectGroup: onSubmit,
    parentPicker: null,
    parentPickerOpen: false,
    handleParentPickerOpenChange: vi.fn()
  }
  return <WorktreeContextMenuOverlays model={model} />
}

describe('project group dialog localization', () => {
  it.each(['project', 'worktree'] as const)(
    'updates the untouched default and action when language changes from the %s menu',
    async (entry) => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      render(
        entry === 'project'
          ? sidebarDialog({ type: 'create-from-repo', repo }, onSubmit)
          : worktreeDialog(onSubmit)
      )

      const input = screen.getByRole('textbox')
      if (!(input instanceof HTMLInputElement)) {
        throw new Error('Expected the project group name input')
      }
      expect(input.value).toBe('CurshFTPGPT group')
      expect(screen.getByRole('button', { name: 'Create' })).toBeTruthy()

      await act(async () => {
        await setRendererUiLanguage('zh')
      })
      expect(input.value).toBe('CurshFTPGPT 项目组')
      expect(screen.getByRole('button', { name: '创建' })).toBeTruthy()

      fireEvent.change(input, { target: { value: 'My custom group 团队' } })
      await act(async () => {
        await setRendererUiLanguage('en')
      })
      expect(input.value).toBe('My custom group 团队')
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Create' }))
      })
      expect(onSubmit).toHaveBeenCalledWith('My custom group 团队')
    }
  )

  it('localizes rename while preserving an existing custom group name', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      sidebarDialog(
        { type: 'rename', groupId: 'group-1', currentName: 'My custom group' },
        onSubmit
      )
    )
    const input = screen.getByRole('textbox')
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Expected the project group name input')
    }
    await act(async () => {
      await setRendererUiLanguage('zh')
    })
    expect(input.value).toBe('My custom group')
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '重命名' }))
    })
    expect(onSubmit).toHaveBeenCalledWith('My custom group')
  })

  it('seeds a different host-owned group even when the previous draft was edited', () => {
    const view = render(
      sidebarDialog({
        type: 'rename',
        groupId: 'group-1',
        currentName: 'First',
        hostId: 'ssh:first'
      })
    )
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Draft first' } })
    view.rerender(
      sidebarDialog({
        type: 'rename',
        groupId: 'group-1',
        currentName: 'Second',
        hostId: 'ssh:second'
      })
    )
    const input = screen.getByRole('textbox')
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Expected the project group name input')
    }
    expect(input.value).toBe('Second')
  })
})
