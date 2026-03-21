import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { DocumentHead } from '@/api/documents'

interface ChapterListProps {
  chapters: DocumentHead[]
  activeChapterId: string
  isLoading: boolean
  onSelectChapter: (id: string) => void
  onCreateChapter: () => void
  onDeleteChapter?: (id: string) => void
}

export default function ChapterList({
  chapters,
  activeChapterId,
  isLoading,
  onSelectChapter,
  onCreateChapter,
  onDeleteChapter
}: ChapterListProps) {
  const [hoveredChapterId, setHoveredChapterId] = useState<string | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {isLoading && <div style={{ padding: '16px', color: '#999', fontSize: '12px' }}>Loading…</div>}
        {!isLoading && chapters.length === 0 && (
          <div style={{ padding: '16px', color: '#999', fontSize: '12px' }}>No chapters yet</div>
        )}
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            onMouseEnter={() => setHoveredChapterId(chapter.id)}
            onMouseLeave={() => setHoveredChapterId(null)}
            style={{ position: 'relative' }}
          >
            <button
              onClick={() => onSelectChapter(chapter.id)}
              aria-label={chapter.name}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 16px',
                border: 'none',
                background: activeChapterId === chapter.id ? '#0f0f0f' : 'transparent',
                color: activeChapterId === chapter.id ? '#ffffff' : '#0f0f0f',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
              }}
            >
              {chapter.name}
            </button>
            {hoveredChapterId === chapter.id && onDeleteChapter && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteChapter(chapter.id)
                }}
                aria-label={`Delete ${chapter.name}`}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '4px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
                title={`Delete ${chapter.name}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding: '16px', borderTop: '1px solid #e5e5e5' }}>
        <button
          onClick={onCreateChapter}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '8px 16px',
            border: '1px solid #e5e5e5',
            background: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          + New Chapter
        </button>
      </div>
    </div>
  )
}
