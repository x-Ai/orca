import { canSourceOwnerOpenInOrca } from '@/lib/http-link-destinations'
import type { HttpLinkSourceOwner } from '@/lib/http-link-routing'
import { translate } from '@/i18n/i18n'

export function isMacPlatform(): boolean {
  return navigator.userAgent.includes('Mac')
}

function terminalLinkActionHintPrefix(showActions: boolean): string {
  return showActions
    ? translate(
        'auto.components.terminal.pane.terminal.link.open.hints.clickForActions',
        'Click for actions, '
      )
    : ''
}

export function getTerminalFileOpenHint(showActions = true): string {
  const prefix = terminalLinkActionHintPrefix(showActions)
  return isMacPlatform()
    ? `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.mac.open.file', '⌘+click to open, or ⇧⌘+click for default app')}`
    : `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.windows.open.file', 'Ctrl+click to open, or Shift+Ctrl+click for default app')}`
}

export function getTerminalOrcaFileOpenHint(showActions = true): string {
  const prefix = showActions
    ? translate(
        'auto.components.terminal.pane.terminal.link.open.hints.clickForActionsOr',
        'Click for actions or '
      )
    : ''
  return isMacPlatform()
    ? `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.mac.open.in.orca', '⌘+click to open in Orca')}`
    : `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.windows.open.in.orca', 'Ctrl+click to open in Orca')}`
}

// Why: local HTML paths keep Shift+modifier as the system-browser shortcut.
export function getTerminalHtmlFileOpenHint(showActions = true): string {
  const prefix = terminalLinkActionHintPrefix(showActions)
  return isMacPlatform()
    ? `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.mac.open.html', '⌘+click to open, or ⇧⌘+click for default browser')}`
    : `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.windows.open.html', 'Ctrl+click to open, or Shift+Ctrl+click for default browser')}`
}

export type TerminalUrlOpenHintOptions = {
  openLinksInApp?: boolean
  modifierInverts?: boolean
  showActions?: boolean
}

// Why: remote owners advertise Orca only when their existing browser route is eligible.
export function terminalUrlOpenHintOptionsFor(
  settings:
    | {
        openLinksInApp?: boolean
        openLinksInAppModifierInverts?: boolean
        activeRuntimeEnvironmentId?: string | null
      }
    | null
    | undefined,
  sourceOwner?: HttpLinkSourceOwner,
  canOpenOwnedBrowser = false
): TerminalUrlOpenHintOptions {
  const sourceCanOpenInOrca = sourceOwner
    ? canSourceOwnerOpenInOrca(sourceOwner, canOpenOwnedBrowser)
    : !settings?.activeRuntimeEnvironmentId?.trim()
  return {
    openLinksInApp: settings?.openLinksInApp === true,
    modifierInverts: settings?.openLinksInAppModifierInverts === true && sourceCanOpenInOrca
  }
}

// Why: with modifierInverts on, Shift no longer always means "system browser" —
// it means "the other one" — so the hint has to name the actual destination.
export function getTerminalUrlOpenHint(options: TerminalUrlOpenHintOptions = {}): string {
  const invertsToOrca = options.modifierInverts === true && options.openLinksInApp !== true
  const prefix = terminalLinkActionHintPrefix(options.showActions !== false)
  if (invertsToOrca) {
    return isMacPlatform()
      ? `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.mac.open.url.orca', '⌘+click to open, or ⇧⌘+click to open in Orca')}`
      : `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.windows.open.url.orca', 'Ctrl+click to open, or Shift+Ctrl+click to open in Orca')}`
  }
  return isMacPlatform()
    ? `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.mac.open.url.system', '⌘+click to open, or ⇧⌘+click for system browser')}`
    : `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.windows.open.url.system', 'Ctrl+click to open, or Shift+Ctrl+click for system browser')}`
}

export function getTerminalUrlSystemBrowserHint(): string {
  return isMacPlatform()
    ? translate(
        'auto.components.terminal.pane.terminal.link.open.hints.mac.system.browser',
        '⇧⌘+click for system browser'
      )
    : translate(
        'auto.components.terminal.pane.terminal.link.open.hints.windows.system.browser',
        'Shift+Ctrl+click for system browser'
      )
}

// Why: the mirror of the system-browser hint for surfaces where inverting sends the
// modifier the other way; a plain click there already opens the system browser.
export function getTerminalUrlOrcaBrowserHint(): string {
  return isMacPlatform()
    ? translate(
        'auto.components.terminal.pane.terminal.link.open.hints.mac.orca.browser',
        '⇧⌘+click to open in Orca'
      )
    : translate(
        'auto.components.terminal.pane.terminal.link.open.hints.windows.orca.browser',
        'Shift+Ctrl+click to open in Orca'
      )
}

export function getTerminalWorktreePathOpenHint(
  canOpenWithSystemDefault: boolean,
  showActions = true
): string {
  const prefix = terminalLinkActionHintPrefix(showActions)
  if (!canOpenWithSystemDefault) {
    const directPrefix = showActions
      ? translate(
          'auto.components.terminal.pane.terminal.link.open.hints.clickForActionsOr',
          'Click for actions or '
        )
      : ''
    return isMacPlatform()
      ? `${directPrefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.mac.switch.workspace', '⌘+click to switch workspace')}`
      : `${directPrefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.windows.switch.workspace', 'Ctrl+click to switch workspace')}`
  }

  return isMacPlatform()
    ? `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.mac.worktree.finder', '⌘+click to switch workspace, or ⇧⌘+click to open in Finder')}`
    : `${prefix}${translate('auto.components.terminal.pane.terminal.link.open.hints.windows.worktree.folder', 'Ctrl+click to switch workspace, or Shift+Ctrl+click to open folder')}`
}
