import { translate } from '@/i18n/i18n'

const FIXED_FAILURES = {
  'Not authorized': () =>
    translate('auto.lib.browser.cookie.import.failure.notAuthorized', 'Not authorized'),
  'Session profile not found.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.sessionProfileMissing',
      'Session profile not found.'
    ),
  'Invalid browser profile name.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.invalidBrowserProfile',
      'Invalid browser profile name.'
    ),
  'Browser not found on this system.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.browserNotFound',
      'Browser not found on this system.'
    ),
  'Target cookie database not found. Open a browser tab first.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.targetDatabaseMissing',
      'Target cookie database not found. Open a browser tab first.'
    ),
  'Could not import: a cookie with an unreadable site partition has no registrable domain, so its existing session cannot be protected.':
    () =>
      translate(
        'auto.lib.browser.cookie.import.failure.unreadablePartitionUnprotected',
        'Could not import: a cookie with an unreadable site partition has no registrable domain, so its existing session cannot be protected.'
      ),
  'This Orca client cannot report cookies skipped for an unreadable site partition. Update Orca on this device and try again.':
    () =>
      translate(
        'auto.lib.browser.cookie.import.failure.partitionReportUnsupported',
        'This Orca client cannot report cookies skipped for an unreadable site partition. Update Orca on this device and try again.'
      ),
  'Could not replace existing cookies for the imported sites.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.replaceExistingFailed',
      'Could not replace existing cookies for the imported sites.'
    ),
  'Could not safely replace cookies for the imported sites.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.replaceSafelyFailed',
      'Could not safely replace cookies for the imported sites.'
    ),
  'Could not read the selected file.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.readFileFailed',
      'Could not read the selected file.'
    ),
  'File is not valid JSON.': () =>
    translate('auto.lib.browser.cookie.import.failure.invalidJson', 'File is not valid JSON.'),
  'Expected a JSON array of cookie objects.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.expectedJsonArray',
      'Expected a JSON array of cookie objects.'
    ),
  'Cookie file is empty.': () =>
    translate('auto.lib.browser.cookie.import.failure.emptyFile', 'Cookie file is empty.'),
  'macOS denied access to Safari cookies. Grant Full Disk Access to Orca in System Settings → Privacy & Security → Full Disk Access.':
    () =>
      translate(
        'auto.lib.browser.cookie.import.failure.safariFullDiskAccess',
        'macOS denied access to Safari cookies. Grant Full Disk Access to Orca in System Settings → Privacy & Security → Full Disk Access.'
      ),
  'The connection to this server ended during the import. Reconnect and try again.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.connectionEnded',
      'The connection to this server ended during the import. Reconnect and try again.'
    ),
  'This server was re-paired during the import. Try again.': () =>
    translate(
      'auto.lib.browser.cookie.import.failure.serverRepaired',
      'This server was re-paired during the import. Try again.'
    ),
  browser_route_partition_binding_conflict: () =>
    translate(
      'auto.lib.browser.cookie.import.failure.routePartitionConflict',
      'The browser storage binding changed. Reconnect and try the import again.'
    )
} satisfies Record<string, () => string>

function formatFailureMessage(reason: string): string {
  const fixed = FIXED_FAILURES[reason as keyof typeof FIXED_FAILURES]
  if (fixed) {
    return fixed()
  }

  let match = /^No cookies database found for profile "(.+)"\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.profileDatabaseMissing',
      'No cookies database found for profile "{{value0}}".',
      { value0: match[1] }
    )
  }
  match = /^Could not copy (.+) cookies database\. Try closing (.+) first\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.copyDatabaseFailed',
      'Could not copy {{value0}} cookies database. Try closing {{value1}} first.',
      { value0: match[1], value1: match[2] }
    )
  }
  match = /^(.+) cookies database not found\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.sourceDatabaseMissing',
      '{{value0}} cookies database not found.',
      { value0: match[1] }
    )
  }
  match = /^No cookies found in (.+)\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.noCookies',
      'No cookies found in {{value0}}.',
      { value0: match[1] }
    )
  }
  match = /^No valid cookies found in (.+)\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.noValidCookies',
      'No valid cookies found in {{value0}}.',
      { value0: match[1] }
    )
  }
  match = /^Could not access (.+) encryption key\. The OS may have denied access\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.encryptionKeyDenied',
      'Could not access {{value0}} encryption key. The OS may have denied access.',
      { value0: match[1] }
    )
  }
  match = /^Could not import cookies from (.+)\. Try closing (.+) first\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.importFailedCloseBrowser',
      'Could not import cookies from {{value0}}. Try closing {{value1}} first.',
      { value0: match[1], value1: match[2] }
    )
  }
  match = /^Could not import cookies from (.+): (.+)\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.importFailedWithDetail',
      'Could not import cookies from {{value0}}: {{value1}}.',
      { value0: match[1], value1: match[2] }
    )
  }
  match = /^Could not read (.+) cookies\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.readBrowserCookiesFailed',
      'Could not read {{value0}} cookies.',
      { value0: match[1] }
    )
  }
  match = /^All (.+) cookies are expired\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.allBrowserCookiesExpired',
      'All {{value0}} cookies are expired.',
      { value0: match[1] }
    )
  }
  match = /^Could not import cookies from (.+)\.$/.exec(reason)
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.importFailed',
      'Could not import cookies from {{value0}}.',
      { value0: match[1] }
    )
  }
  match =
    /^No valid cookies found\. (\d+) entries were skipped due to missing or invalid fields\.$/.exec(
      reason
    )
  if (match) {
    return translate(
      'auto.lib.browser.cookie.import.failure.invalidEntries',
      'No valid cookies found. {{value0}} entries were skipped due to missing or invalid fields.',
      { value0: match[1] }
    )
  }
  return reason
}

export function formatBrowserCookieImportFailure(reason: string): string {
  const diagnostic = /^(.*) Details were written to (.+)\.$/.exec(reason)
  const message = formatFailureMessage(diagnostic?.[1] ?? reason)
  if (!diagnostic) {
    return message
  }
  return translate(
    'auto.lib.browser.cookie.import.failure.diagnosticDetails',
    '{{value0}} Details were written to {{value1}}.',
    { value0: message, value1: diagnostic[2] }
  )
}
