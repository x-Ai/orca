import { translate } from '../../../src/renderer/src/i18n/i18n'

/** Copy for the sheet that picks an agent session to send the review notes to. */
export function sendReviewNotesSheetCopy(): { title: string; message: string } {
  return {
    title: translate('mobile.app.h.hostId.session.worktreeId.sendReviewNotes', 'Send Review Notes'),
    message: translate(
      'mobile.app.h.hostId.session.worktreeId.chooseAgentSession',
      'Choose an agent session for the current notes.'
    )
  }
}
