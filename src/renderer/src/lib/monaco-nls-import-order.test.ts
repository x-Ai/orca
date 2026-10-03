/**
 * Monaco bakes every action and context-menu label with localize() the moment its contribution
 * modules evaluate, reading the NLS pack monaco-nls.ts puts on globalThis. A static value import
 * of `monaco-editor` anywhere in the renderer is hoisted ahead of that bootstrap by the bundler,
 * so the whole editor evaluates in English and stays that way — only monaco-setup.ts may load the
 * package, after `monacoNlsBootstrap()` resolves. Deep imports are held to the same bar unless the
 * module is one that provably calls no localize() at evaluation time.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'
// TypeScript 7 is a native CLI; AST tests still need the legacy JavaScript API.
import ts from 'typescript-api'
import { describe, expect, it } from 'vitest'

const RENDERER_ROOT = resolve('src/renderer/src')
const PACKAGE_LOADER = 'lib/monaco-setup.ts'
const NLS_LOADER = 'lib/monaco-nls.ts'

// Imported by monaco-setup.ts only after the NLS pack landed, so they may touch contributions.
const POST_NLS_MODULES = new Set([
  PACKAGE_LOADER,
  'lib/monaco-peek-preview-options.ts',
  'components/editor/install-monaco-context-menu-paste.ts'
])
const POST_NLS_BASENAMES = /(^|\/)(monaco-peek-preview-options|install-monaco-context-menu-paste)$/

// Enum tables, core value types and Monarch grammars: no localize() at evaluation time.
const PURE_MODULES = new Set([
  'monaco-editor/esm/vs/base/common/async.js',
  'monaco-editor/esm/vs/base/common/lifecycle.js',
  'monaco-editor/esm/vs/base/common/uri.js',
  'monaco-editor/esm/vs/editor/common/core/range.js',
  'monaco-editor/esm/vs/editor/common/standalone/standaloneEnums.js'
])
const PURE_PREFIXES = ['monaco-editor/esm/vs/basic-languages/']

function collectProductionSources(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const filePath = resolve(dir, name)
    if (statSync(filePath).isDirectory()) {
      collectProductionSources(filePath, files)
    } else if (
      /\.(ts|tsx)$/.test(name) &&
      !/\.(test|bench)\.(ts|tsx)$/.test(name) &&
      !name.endsWith('.d.ts') &&
      !/fixture|test-harness/.test(name)
    ) {
      files.push(filePath)
    }
  }
  return files
}

function violationFor(file: string, specifier: string, typeOnly: boolean): string | null {
  if (specifier === 'monaco-editor') {
    if (typeOnly || file === PACKAGE_LOADER) {
      return null
    }
    return `value import of 'monaco-editor' outside ${PACKAGE_LOADER} (use \`import type\`)`
  }
  if (!specifier.startsWith('monaco-editor/')) {
    return POST_NLS_BASENAMES.test(specifier) && file !== PACKAGE_LOADER
      ? `imports a post-NLS module; only ${PACKAGE_LOADER} may, after the bootstrap`
      : null
  }
  if (typeOnly || specifier.endsWith('?worker') || specifier.endsWith('.css')) {
    return null
  }
  if (/^monaco-editor\/esm\/nls\.messages\.[\w-]+\.js$/.test(specifier)) {
    return file === NLS_LOADER ? null : `loads an NLS pack outside ${NLS_LOADER}`
  }
  if (PURE_MODULES.has(specifier) || PURE_PREFIXES.some((prefix) => specifier.startsWith(prefix))) {
    return null
  }
  return POST_NLS_MODULES.has(file)
    ? null
    : `imports a Monaco module that may bake localized labels (${specifier})`
}

function collectViolations(file: string, sourceFile: ts.SourceFile): string[] {
  const violations: string[] = []
  const report = (node: ts.Node, specifier: string, typeOnly: boolean): void => {
    const reason = violationFor(file, specifier, typeOnly)
    if (reason) {
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
      violations.push(`${file}:${line + 1} ${reason}`)
    }
  }
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      report(node, node.moduleSpecifier.text, node.importClause?.isTypeOnly ?? false)
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      if (ts.isStringLiteral(node.moduleSpecifier)) {
        report(node, node.moduleSpecifier.text, node.isTypeOnly)
      }
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      report(node, node.arguments[0].text, false)
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return violations
}

describe('Monaco NLS import order', () => {
  it('lets only monaco-setup.ts evaluate Monaco, after the NLS pack is loaded', () => {
    const violations: string[] = []
    for (const filePath of collectProductionSources(RENDERER_ROOT)) {
      const source = readFileSync(filePath, 'utf8')
      if (!source.includes('monaco-editor') && !POST_NLS_BASENAMES.test(source)) {
        continue
      }
      const file = relative(RENDERER_ROOT, filePath).split(sep).join('/')
      const sourceFile = ts.createSourceFile(
        filePath,
        source,
        ts.ScriptTarget.Latest,
        true,
        filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      )
      violations.push(...collectViolations(file, sourceFile))
    }
    expect(violations).toEqual([])
  }, 15_000)
})
