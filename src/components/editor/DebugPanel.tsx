import { useState } from 'react'
import type { DocumentHead } from '@/api/documents'

interface DebugPanelProps {
  activeChapterId: string | null
  chapters: DocumentHead[]
  content: string
  isSaving: boolean
  isLoading: boolean
}

export default function DebugPanel({
  activeChapterId,
  chapters,
  content,
  isSaving,
  isLoading
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        top: 60,
        right: 0,
        background: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '12px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '8px',
          userSelect: 'none'
        }}
      >
        🔧 Debug {isOpen ? '▼' : '▶'}
      </div>

      {isOpen && (
        <div style={{ fontSize: '11px' }}>
          <div style={{ marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
            <div>
              <strong>Active Chapter:</strong> <span style={{ color: isLoading ? '#f0a000' : '#000' }}>
                {activeChapterId || 'none'}
              </span>
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span style={{ color: isSaving ? '#f0a000' : isLoading ? '#0066cc' : '#00aa00' }}>
                {isSaving ? '💾 Saving' : isLoading ? '⏳ Loading' : '✓ Ready'}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
            <strong>Chapters ({chapters.length}):</strong>
            <div style={{ marginLeft: '8px', marginTop: '4px' }}>
              {chapters.length === 0 ? (
                <div style={{ color: '#999' }}>No chapters</div>
              ) : (
                chapters.map((ch) => (
                  <div
                    key={ch.id}
                    style={{
                      padding: '4px',
                      background: ch.id === activeChapterId ? '#cce5ff' : 'transparent',
                      borderLeft: ch.id === activeChapterId ? '3px solid #0066cc' : 'none',
                      marginBottom: '2px',
                      color: ch.id === activeChapterId ? '#0066cc' : '#666'
                    }}
                  >
                    <div>{ch.name}</div>
                    <div style={{ fontSize: '10px', color: '#999' }}>
                      ID: {ch.id.slice(0, 8)}...
                    </div>
                    <div style={{ fontSize: '10px', color: '#999' }}>
                      Updated: {new Date(ch.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <strong>Content:</strong>
            <div
              style={{
                fontSize: '10px',
                color: '#666',
                marginTop: '4px',
                padding: '4px',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '2px',
                maxHeight: '100px',
                overflowY: 'auto'
              }}
            >
              {content ? (
                <>
                  {content.length} bytes<br />
                  {content.slice(0, 100)}
                  {content.length > 100 ? '...' : ''}
                </>
              ) : (
                <span style={{ color: '#999' }}>Empty</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
