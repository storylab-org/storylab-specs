import { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import EditorArea from '@/components/editor/EditorArea'
import EditorToolbar from '@/components/editor/EditorToolbar'
import DebugPanel from '@/components/editor/DebugPanel'
import {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  type DocumentHead
} from '@/api/documents'
import { exportBook, triggerDownload, type ExportFormat } from '@/api/export'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function EditorLayout() {
  const [chapters, setChapters] = useState<DocumentHead[]>([])
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isLoading, setIsLoading] = useState(true)
  const [loadedChapterId, setLoadedChapterId] = useState<string | null>(null)
  const [wordCount, setWordCount] = useState(0)

  const activeChapter = chapters.find((c) => c.id === activeChapterId)

  // Load documents on mount
  useEffect(() => {
    const loadChapters = async () => {
      setIsLoading(true)
      try {
        console.log('[INIT] Loading chapters on app startup...')
        let docs = await listDocuments()
        console.log(`[INIT] Found ${docs.length} chapters`)

        // Create default chapter if none exist
        if (docs.length === 0) {
          console.log('[INIT] No chapters found, creating default "Untitled" chapter...')
          const defaultChapter = await createDocument('Untitled', '')
          docs = [defaultChapter]
          console.log(`[INIT] ✓ Created default chapter with ID "${defaultChapter.id}"`)
        }

        console.log(`[INIT] ✓ Setting chapters list: ${docs.map(d => d.id).join(', ')}`)
        setChapters(docs)
        console.log(`[INIT] ✓ Setting active chapter to "${docs[0].id}"`)
        setActiveChapterId(docs[0].id)
      } catch (error) {
        console.error('[INIT] ✗ Failed to load chapters:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChapters()
  }, [])

  // Load document content when active chapter changes
  useEffect(() => {
    if (!activeChapterId) return

    const loadDocument = async () => {
      setIsLoading(true)
      try {
        console.log(`[LOAD] Loading chapter "${activeChapterId}"...`)
        const doc = await getDocument(activeChapterId)
        console.log(`[LOAD] ✓ Loaded chapter "${activeChapterId}" (name: "${doc.name}", ${doc.content.length} bytes)`)
        setContent(doc.content)
        setLoadedChapterId(activeChapterId)
      } catch (error) {
        console.error(`[LOAD] ✗ Failed to load chapter "${activeChapterId}":`, error)
        setContent('')
        setLoadedChapterId(activeChapterId)
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [activeChapterId])

  // Auto-save when content changes (OnChangePlugin updates state immediately)
  useEffect(() => {
    if (saveStatus === 'saved') {
      // Reset to idle after 3 seconds
      const timer = setTimeout(() => setSaveStatus('idle'), 3000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus])

  const handleSelectChapter = (id: string) => {
    console.log(`[SWITCH] Switching to chapter "${id}"`)
    setActiveChapterId(id)
  }

  const handleCreateChapter = async () => {
    try {
      console.log('[CREATE] Creating new chapter...')
      const newChapter = await createDocument('New Chapter', '')
      console.log(`[CREATE] ✓ New chapter created with ID "${newChapter.id}"`)

      // Refresh chapter list from server to ensure consistency
      console.log('[CREATE] Refreshing chapter list...')
      const docs = await listDocuments()
      console.log(`[CREATE] ✓ Got ${docs.length} chapters, selecting first: "${docs[0]?.id}"`)

      setChapters(docs)
      if (docs.length > 0) {
        setActiveChapterId(docs[0].id)
      }
    } catch (error) {
      console.error('[CREATE] ✗ Failed to create chapter:', error)
    }
  }

  const handleDeleteChapter = async (id: string) => {
    try {
      console.log(`[DELETE] Deleting chapter "${id}"...`)
      await deleteDocument(id)
      console.log(`[DELETE] ✓ Chapter "${id}" deleted`)

      // Remove from chapters list
      const updatedChapters = chapters.filter(c => c.id !== id)
      setChapters(updatedChapters)

      // If deleted chapter was active, select an adjacent chapter
      if (activeChapterId === id) {
        if (updatedChapters.length > 0) {
          // Find the deleted chapter's index in the original list
          const deletedIndex = chapters.findIndex(c => c.id === id)
          // Prefer next chapter, otherwise fall back to previous
          let nextChapterId: string
          if (deletedIndex < updatedChapters.length) {
            nextChapterId = updatedChapters[deletedIndex].id
          } else {
            nextChapterId = updatedChapters[updatedChapters.length - 1].id
          }
          console.log(`[DELETE] Active chapter deleted, switching to "${nextChapterId}"`)
          setActiveChapterId(nextChapterId)
        } else {
          // No chapters remain, create a default "Untitled" chapter
          console.log('[DELETE] No chapters remain, creating default "Untitled" chapter...')
          const defaultChapter = await createDocument('Untitled', '')
          console.log(`[DELETE] ✓ Created default chapter "${defaultChapter.id}"`)
          setChapters([defaultChapter])
          setActiveChapterId(defaultChapter.id)
        }
      }
    } catch (error) {
      console.error(`[DELETE] ✗ Failed to delete chapter "${id}":`, error)
    }
  }

  const handleExport = async (format: 'markdown' | 'html' | 'epub' | 'pdf') => {
    if (format === 'pdf') {
      console.log('PDF export not yet implemented')
      return
    }

    try {
      console.log(`[EXPORT] Starting ${format.toUpperCase()} export...`)
      const blob = await exportBook(format as ExportFormat)
      const filename = `book.${format}`
      triggerDownload(blob, filename)
      console.log(`[EXPORT] ✓ ${format.toUpperCase()} export completed`)
    } catch (error) {
      console.error(`[EXPORT] ✗ Failed to export ${format}:`, error)
    }
  }

  const handleSave = async () => {
    if (!activeChapterId) return

    setSaveStatus('saving')
    try {
      console.log(`[SAVE] Saving chapter "${activeChapterId}"`)
      console.log(`[SAVE] Content length: ${content.length} bytes`)
      console.log(`[SAVE] Content preview: ${content.substring(0, 100)}`)
      await updateDocument(activeChapterId, content)
      console.log(`[SAVE] ✓ Chapter "${activeChapterId}" saved successfully`)
      setSaveStatus('saved')
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error(`[SAVE] ✗ Failed to save chapter "${activeChapterId}":`, error)
      setSaveStatus('error')
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#ffffff' }}>
      <DebugPanel
        activeChapterId={activeChapterId}
        chapters={chapters}
        content={content}
        saveStatus={saveStatus}
        isLoading={isLoading}
      />
      <Sidebar
        activeChapterId={activeChapterId || ''}
        onSelectChapter={handleSelectChapter}
        chapters={chapters}
        isLoading={isLoading}
        onCreateChapter={handleCreateChapter}
        onDeleteChapter={handleDeleteChapter}
      />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <EditorToolbar
          chapterId={activeChapterId || ''}
          chapterTitle={activeChapter?.name || 'Untitled'}
          saveStatus={saveStatus}
          onSave={handleSave}
          onExport={handleExport}
        />
        {activeChapterId && loadedChapterId === activeChapterId && (
          <EditorArea
            key={activeChapterId}
            chapterId={activeChapterId}
            content={content}
            onChange={(newContent) => {
              console.log(`[EDITOR] Content changed: ${newContent.length} bytes`)
              setContent(newContent)
            }}
            onWordCountChange={setWordCount}
          />
        )}
        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#999', borderTop: '1px solid #e5e5e5' }}>
          {wordCount} words
        </div>
      </div>
    </div>
  )
}
