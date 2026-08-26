import { translate } from '@/i18n/i18n'

function getWorktreeContextMenuSleepLabel(args: {
  isMultiContext: boolean
  count: number
}): string {
  if (!args.isMultiContext || args.count === 0) {
    return translate('auto.components.sidebar.WorktreeContextMenu.ad9068e91a', 'Sleep')
  }
  return args.count === 1
    ? translate('auto.components.sidebar.WorktreeContextMenu.b50091a3e1', 'Sleep 1 Workspace')
    : translate(
        'auto.components.sidebar.WorktreeContextMenu.f28bf93f81',
        'Sleep {{count}} Workspaces',
        { count: args.count }
      )
}

function getWorktreeContextMenuDeleteLabel(args: {
  isMultiContext: boolean
  count: number
}): string {
  if (!args.isMultiContext || args.count === 0) {
    return translate('auto.components.sidebar.WorktreeContextMenu.287b12a639', 'Delete Selected')
  }
  return args.count === 1
    ? translate('auto.components.sidebar.WorktreeContextMenu.59bb2e3856', 'Delete 1 Workspace')
    : translate(
        'auto.components.sidebar.WorktreeContextMenu.fc5d59429d',
        'Delete {{count}} Workspaces',
        { count: args.count }
      )
}

export function getWorktreeContextMenuCountLabels(args: {
  isMultiContext: boolean
  sleepCount: number
  deleteCount: number
}): { sleepLabel: string; deleteLabel: string } {
  return {
    sleepLabel: getWorktreeContextMenuSleepLabel({
      isMultiContext: args.isMultiContext,
      count: args.sleepCount
    }),
    deleteLabel: getWorktreeContextMenuDeleteLabel({
      isMultiContext: args.isMultiContext,
      count: args.deleteCount
    })
  }
}
