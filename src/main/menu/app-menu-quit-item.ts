import { translateMain } from '../i18n/main-i18n'

/**
 * The app menu's Quit entry: "Quit <macAppName>" in the macOS app menu, else File > Exit.
 * Why a handler instead of role 'quit': a host that must not exit on a user Quit
 * (`orca serve`, #15537) supplies `onQuit`; the native-quit guard only covers macOS.
 * The label is set on the native role too so it follows Orca's UI language, not the OS locale.
 */
export function createAppMenuQuitItem(
  onQuit: (() => void) | undefined,
  macAppName?: string
): Electron.MenuItemConstructorOptions {
  const label =
    macAppName === undefined
      ? translateMain('menu.exit', 'Exit')
      : translateMain('menu.quitApp', `Quit ${macAppName}`, { appName: macAppName })
  if (!onQuit) {
    return { role: 'quit', label }
  }
  return {
    label,
    // Same accelerator Electron gives role 'quit' (none on Windows).
    ...(process.platform === 'win32' ? {} : { accelerator: 'CmdOrCtrl+Q' }),
    click: () => onQuit()
  }
}
