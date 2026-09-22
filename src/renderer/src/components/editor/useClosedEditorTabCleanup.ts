import { useEffect, useRef } from 'react'
// Why: never import 'monaco-editor' directly — monaco-setup gates evaluation
// on the NLS bootstrap so action labels localize on first editor open.
import { monaco } from '@/lib/monaco-setup'
import type { OpenFile } from '@/store/slices/editor'
import { disposeClosedEditorTabs } from './closed-editor-tab-disposal'

export function useClosedEditorTabCleanup(openFiles: OpenFile[]): void {
  const prevOpenFilesRef = useRef<Map<string, OpenFile>>(new Map())

  useEffect(() => {
    const currentFilesById = new Map(openFiles.map((f) => [f.id, f]))
    const closedFiles: OpenFile[] = []
    for (const [prevId, prevFile] of prevOpenFilesRef.current) {
      if (!currentFilesById.has(prevId)) {
        closedFiles.push(prevFile)
      }
    }
    // Why one call for the whole removal batch: each sweep scans a shared registry/cache, so
    // per-tab sweeps make a "close all" quadratic in retained models.
    disposeClosedEditorTabs(monaco, closedFiles)
    prevOpenFilesRef.current = currentFilesById
  }, [openFiles])
}
