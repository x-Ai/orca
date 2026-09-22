import {
  GITHUB_PR_MERGE_METHOD_I18N_KEYS,
  GITHUB_PR_MERGE_METHOD_LABELS,
  resolveGitHubPRMergeMethods as resolveMergeMethods
} from '../../../shared/github/pull-request-merge-methods'
import type {
  GitHubPRMergeMethod,
  GitHubPRMergeMethodSettings
} from '../../../shared/github/pull-request-types'
import { translate } from '@/i18n/i18n'

function localizedMergeMethodLabel(method: GitHubPRMergeMethod): string {
  return translate(GITHUB_PR_MERGE_METHOD_I18N_KEYS[method], GITHUB_PR_MERGE_METHOD_LABELS[method])
}

export function resolveLocalizedGitHubPRMergeMethods(
  settings?: GitHubPRMergeMethodSettings | null
): ReturnType<typeof resolveMergeMethods> {
  const presentation = resolveMergeMethods(settings)
  return {
    ...presentation,
    defaultLabel: localizedMergeMethodLabel(presentation.defaultMethod),
    methods: presentation.methods.map(({ method }) => ({
      method,
      label: localizedMergeMethodLabel(method)
    }))
  }
}
