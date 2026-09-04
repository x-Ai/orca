import { translate } from '@/i18n/i18n'

export function missingSpeechModelToastMessage(): string {
  return translate(
    'auto.components.dictation.DictationController.noSpeechModel',
    'No speech model selected. Download one in Settings > Voice.'
  )
}

export function dictationDisabledToastMessage(): string {
  return translate(
    'auto.components.dictation.DictationController.dictationDisabled',
    'Voice dictation is disabled. Enable it in Settings > Voice.'
  )
}

export function speechModelNotReadyToastMessage(): string {
  return translate(
    'auto.components.dictation.DictationController.speechModelNotReady',
    'Speech model not ready. Download it in Settings > Voice.'
  )
}

export function speechModelUnavailableToastMessage(): string {
  return translate(
    'auto.components.dictation.DictationController.speechModelUnavailable',
    'Selected model is no longer available. Please choose another in Settings > Voice.'
  )
}
