// The main bundle is minified for release builds, so Rollup may rename these
// locals and Oxc may print string literals with backticks. Match declarations
// by their validated values rather than source-level variable names.
// Oxc can combine adjacent declarations into `var a = ..., b = ...`.
const DECLARATION = String.raw`(?:\b(?:const|let|var)\s+|,\s*)[A-Za-z_$][\w$]*\s*=\s*`
const QUOTE = `["'\x60]`
const END_QUOTE = `["'\x60]`

export const BUILD_IDENTITY_RE = new RegExp(`${DECLARATION}${QUOTE}(rc|stable)${END_QUOTE}`)
export const WRITE_KEY_RE = new RegExp(`${DECLARATION}${QUOTE}(phc_[A-Za-z0-9_-]+)${END_QUOTE}`)
export const MINIFIED_TELEMETRY_RE =
  /\b(?:const|let|var)\s+[$\w]+\s*=\s*["'`](rc|stable)["'`][\s\S]{0,200}?[,$]\s*[$\w]+\s*=\s*["'`](phc_[A-Za-z0-9_-]+)["'`]/
