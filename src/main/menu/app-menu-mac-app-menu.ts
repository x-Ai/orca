import { createAppMenuQuitItem } from './app-menu-quit-item'
import { labeledAppMenuRole } from './labeled-app-menu-role'

/** The darwin app-named menu; its native roles carry translated labels in this fork. */
export function createMacAppMenu(options: {
  appMenuLabel: string
  checkForUpdatesItem: Electron.MenuItemConstructorOptions
  settingsItem: Electron.MenuItemConstructorOptions
  onQuit: Parameters<typeof createAppMenuQuitItem>[0]
}): Electron.MenuItemConstructorOptions {
  return {
    label: options.appMenuLabel,
    submenu: [
      labeledAppMenuRole('about', 'menu.about', 'About Orca'),
      options.checkForUpdatesItem,
      options.settingsItem,
      { type: 'separator' },
      labeledAppMenuRole('services', 'menu.services', 'Services'),
      { type: 'separator' },
      labeledAppMenuRole('hide', 'menu.hide', 'Hide Orca'),
      labeledAppMenuRole('hideOthers', 'menu.hideOthers', 'Hide Others'),
      labeledAppMenuRole('unhide', 'menu.unhide', 'Show All'),
      { type: 'separator' },
      createAppMenuQuitItem(options.onQuit, options.appMenuLabel)
    ]
  }
}
