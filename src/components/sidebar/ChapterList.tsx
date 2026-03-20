import type { DocumentHead } from '@/api/documents'

interface ChapterListProps {
  chapters: DocumentHead[]
  activeChapterId: string
  isLoading: boolean
  onSelectChapter: (id: string) => void
  onCreateChapter: () => void
}

export default function ChapterList({
  chapters,
  activeChapterId,
  isLoading,
  onSelectChapter,
  onCreateChapter
}: ChapterListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {isLoading && <div style={{ padding: '16px', color: '#999', fontSize: '12px' }}>Loading…</div>}
        {!isLoading && chapters.length === 0 && (
          <div style={{ padding: '16px', color: '#999', fontSize: '12px' }}>No chapters yet</div>
        )}
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
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
