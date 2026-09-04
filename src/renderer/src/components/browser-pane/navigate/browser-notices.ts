import type {
  BrowserDownloadFinishedEvent,
  BrowserPermissionDeniedEvent,
  BrowserPopupEvent
} from '../../../../../shared/browser-guest-events'
import type { BrowserLoadError } from '../../../../../shared/browser-workspace-types'
import { isChromiumCertificateErrorCode } from '../../../../../shared/browser-certificate-errors'
import { translate } from '@/i18n/i18n'
import { BROWSER_GUEST_RECOVERY_ERROR_CODE } from '../host-guest/browser-page-guest-recovery'

export type LoadFailureMeta = {
  host: string | null
  isLocalhostLike: boolean
}

type BrowserLoadErrorLike = BrowserLoadError | null

// Unknown Chromium permissions keep their raw name instead of disappearing behind invented copy.
function humanizePermission(permission: string): string {
  switch (permission) {
    case 'media':
      return translate('browser.notices.permissions.media', 'camera or microphone access')
    case 'pointerLock':
      return translate('browser.notices.permissions.pointerLock', 'pointer lock')
    case 'storage-access':
      return translate(
        'browser.notices.permissions.storageAccess',
        'access to its own cookies and storage while embedded on this page'
      )
    case 'top-level-storage-access':
      return translate(
        'browser.notices.permissions.topLevelStorageAccess',
        'cookie access on behalf of an embedded site'
      )
    case 'geolocation':
      return translate('browser.notices.permissions.geolocation', 'your location')
    case 'idle-detection':
      return translate(
        'browser.notices.permissions.idleDetection',
        'permission to detect when you are idle'
      )
    case 'display-capture':
      return translate(
        'browser.notices.permissions.displayCapture',
        'permission to capture your screen'
      )
    case 'window-management':
      return translate(
        'browser.notices.permissions.windowManagement',
        'screen information and multi-screen window placement'
      )
    case 'keyboardLock':
      return translate(
        'browser.notices.permissions.keyboardLock',
        'permission to capture keyboard input'
      )
    case 'openExternal':
      return translate(
        'browser.notices.permissions.openExternal',
        'permission to open a link outside Orca'
      )
    case 'fileSystem':
      return translate('browser.notices.permissions.fileSystem', 'access to your files or folders')
    case 'hid':
      return translate(
        'browser.notices.permissions.hid',
        'access to a connected human interface device'
      )
    case 'usb':
      return translate('browser.notices.permissions.usb', 'access to a USB device')
    case 'serial':
      return translate('browser.notices.permissions.serial', 'access to a serial device')
    case 'midi':
      return translate('browser.notices.permissions.midi', 'access to your MIDI devices')
    case 'midiSysex':
      return translate(
        'browser.notices.permissions.midiSysex',
        'access to system-exclusive MIDI messages'
      )
    case 'mediaKeySystem':
      return translate(
        'browser.notices.permissions.mediaKeySystem',
        'access to protected media playback'
      )
    case 'speaker-selection':
      return translate(
        'browser.notices.permissions.speakerSelection',
        'permission to choose an audio output device'
      )
    default:
      return permission
  }
}

export function formatPermissionNotice(event: BrowserPermissionDeniedEvent): string {
  const target =
    event.origin === 'unknown' ? translate('browser.notices.thisPage', 'this page') : event.origin
  return translate(
    'browser.notices.permissionDenied',
    '{{target}} asked for {{permission}}, and Orca denied it.',
    { target, permission: humanizePermission(event.permission) }
  )
}

export function formatPopupNotice(event: BrowserPopupEvent): string {
  const target =
    event.origin === 'unknown' ? translate('browser.notices.aSite', 'A site') : event.origin
  if (event.action === 'opened-in-orca') {
    return translate('browser.notices.popupOpenedInOrca', '{{target}} opened a new page in Orca.', {
      target
    })
  }
  if (event.action === 'opened-external') {
    return translate(
      'browser.notices.popupOpenedExternal',
      '{{target}} opened a new window in your default browser.',
      { target }
    )
  }
  return translate(
    'browser.notices.popupUnsupported',
    '{{target}} tried to open a popup Orca does not support here.',
    { target }
  )
}

export function formatDownloadFinishedNotice(event: BrowserDownloadFinishedEvent): string {
  if (event.status === 'completed') {
    return event.savePath
      ? translate('browser.notices.downloadedTo', 'Downloaded to {{path}}.', {
          path: event.savePath
        })
      : translate('browser.notices.downloadComplete', 'Download complete.')
  }
  if (event.status === 'failed') {
    return event.error ?? translate('browser.notices.downloadFailed', 'Download failed.')
  }
  return event.error ?? translate('browser.notices.downloadCanceled', 'Download canceled.')
}

export function formatByteCount(bytes: number | null): string | null {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) {
    return null
  }
  if (bytes < 1024) {
    return `${bytes} B`
  }
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`
}

export function formatLoadFailureDescription(
  loadError: BrowserLoadErrorLike,
  meta: LoadFailureMeta
): string {
  if (!loadError) {
    return 'The page did not respond.'
  }
  if (loadError.code === BROWSER_GUEST_RECOVERY_ERROR_CODE) {
    return loadError.description
  }
  if (isChromiumCertificateErrorCode(loadError.code)) {
    const host = meta.host ?? 'this address'
    if (loadError.code === -200) {
      return translate(
        'browser.loadFailure.certificateNameMismatch',
        "The certificate doesn't match {{value0}}.",
        { value0: host }
      )
    }
    if (loadError.code === -201) {
      return translate(
        'browser.loadFailure.certificateDateInvalid',
        "The certificate for {{value0}} isn't valid at the current date and time.",
        { value0: host }
      )
    }
    if (loadError.code === -202) {
      return translate(
        'browser.loadFailure.certificateAuthorityInvalid',
        "Orca doesn't trust the authority that issued the certificate for {{value0}}.",
        { value0: host }
      )
    }
    return translate(
      'browser.loadFailure.certificateVerificationFailed',
      "Orca couldn't verify the certificate for {{value0}}.",
      { value0: host }
    )
  }
  if (meta.isLocalhostLike) {
    return "We couldn't connect to your local server."
  }
  if (loadError.code === 0) {
    return loadError.description
  }
  return "We couldn't connect to this page."
}

export function formatLoadFailureRecoveryHint(
  meta: LoadFailureMeta,
  loadError?: BrowserLoadErrorLike
): string | null {
  if (
    !meta.isLocalhostLike ||
    loadError?.code === BROWSER_GUEST_RECOVERY_ERROR_CODE ||
    (loadError && isChromiumCertificateErrorCode(loadError.code))
  ) {
    return null
  }
  return 'If this should be a local app, make sure the server is running and listening on the expected port.'
}

export function isCertificateLoadError(loadError: BrowserLoadErrorLike): boolean {
  return Boolean(loadError && isChromiumCertificateErrorCode(loadError.code))
}
