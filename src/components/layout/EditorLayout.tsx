import { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import EditorArea from '@/components/editor/EditorArea'
import EditorToolbar from '@/components/editor/EditorToolbar'
import EditorErrorDisplay from '@/components/editor/EditorErrorDisplay'
import DebugPanel from '@/components/editor/DebugPanel'
import {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  type DocumentHead
} from '@/api/documents'

export default function EditorLayout() {
  const [chapters, setChapters] = useState<DocumentHead[]>([])
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const wordCount = content.split(/\s+/).filter(Boolean).length
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
      } catch (error) {
        console.error(`[LOAD] ✗ Failed to load chapter "${activeChapterId}":`, error)
        setContent('')
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [activeChapterId])

  const handleSave = async () => {
    if (!activeChapterId) return

    setIsSaving(true)
    try {
      console.log(`[SAVE] Saving chapter "${activeChapterId}" with ${content.length} bytes`)
      await updateDocument(activeChapterId, content)
      console.log(`[SAVE] ✓ Chapter "${activeChapterId}" saved successfully`)
    } catch (error) {
      console.error(`[SAVE] ✗ Failed to save chapter "${activeChapterId}":`, error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectChapter = (id: string) => {
    console.log(`[SWITCH] Switching to chapter "${id}"`)
    setActiveChapterId(id)
  }

  const handleCreateChapter = async () => {
    try {
      setIsSaving(true)
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
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = (format: 'markdown' | 'html' | 'pdf') => {
    // TODO: Implement export functionality
    console.log('Exporting as:', format, content)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#ffffff' }}>
      <EditorErrorDisplay />
      <DebugPanel
        activeChapterId={activeChapterId}
        chapters={chapters}
        content={content}
        isSaving={isSaving}
        isLoading={isLoading}
      />
      <Sidebar
        activeChapterId={activeChapterId || ''}
        onSelectChapter={handleSelectChapter}
        chapters={chapters}
        isLoading={isLoading}
        onCreateChapter={handleCreateChapter}
      />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <EditorToolbar
          chapterId={activeChapterId || ''}
          chapterTitle={activeChapter?.name || 'Untitled'}
          wordCount={wordCount}
          isSaving={isSaving}
          onSave={handleSave}
          onExport={handleExport}
        />
        {activeChapterId && (
          <EditorArea
            key={activeChapterId}
            chapterId={activeChapterId}
            content={content}
            onChange={(newContent) => {
              console.log(`[STATE] Content state updated: ${newContent.length} bytes for chapter "${activeChapterId}"`)
              setContent(newContent)
            }}
          />
        )}
        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#999', borderTop: '1px solid #e5e5e5' }}>
          {wordCount} words
        </div>
      </div>
    </div>
  )
}
