import { stripCredentialsFromMessage } from '../../../shared/git-remote-error'

const REMOTE_OPERATION_DETAIL_MAX_LENGTH = 200

export function truncateRemoteOperationDetail(detail: string): string {
  if (detail.length <= REMOTE_OPERATION_DETAIL_MAX_LENGTH) {
    return detail
  }
  return `${detail.slice(0, REMOTE_OPERATION_DETAIL_MAX_LENGTH).trimEnd()}...`
}

export function extractPublishFailureDetail(message: string): string | null {
  let remoteDetail: string | null = null

  for (const rawLine of iterateRemoteErrorLines(message)) {
    const line = rawLine.trim()
    if (!line) {
      continue
    }
    if (line.startsWith('fatal:')) {
      return truncateRemoteOperationDetail(
        stripCredentialsFromMessage(line.slice('fatal:'.length).trim())
      )
    }
    if (remoteDetail === null && line.startsWith('remote:')) {
      remoteDetail = truncateRemoteOperationDetail(
        stripCredentialsFromMessage(line.slice('remote:'.length).trim())
      )
    }
  }

  return remoteDetail
}

export function resolveRemoteOperationDetail(message: string): string {
  return (
    extractPublishFailureDetail(message) ??
    truncateRemoteOperationDetail(stripCredentialsFromMessage(message))
  )
}

function* iterateRemoteErrorLines(message: string): Generator<string> {
  let lineStart = 0

  for (let index = 0; index < message.length; index++) {
    const code = message.charCodeAt(index)
    if (code !== 10 && code !== 13) {
      continue
    }

    yield message.slice(lineStart, index)
    if (code === 13 && message.charCodeAt(index + 1) === 10) {
      index++
    }
    lineStart = index + 1
  }

  if (lineStart <= message.length) {
    yield message.slice(lineStart)
  }
}
