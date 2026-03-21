import LexicalEditor from '@/components/editor/LexicalEditor'
import EditorErrorBoundary from '@/components/editor/EditorErrorBoundary'

interface EditorAreaProps {
  chapterId: string
  content?: string
  onChange: (content: string) => void
}

export default function EditorArea({ chapterId, content, onChange }: EditorAreaProps) {
  const handleContentChange = (serialisedState: string, _wordCount: number) => {
    console.log(`[EDITOR] Content changed: ${serialisedState.length} bytes`)
    onChange(serialisedState)
  }

  return (
    <EditorErrorBoundary>
      <div style={{ flex: 1, overflowY: 'auto', background: '#f9f9f9' }}>
        <LexicalEditor
          chapterId={chapterId}
          initialContent={content}
          onContentChange={handleContentChange}
        />
      </div>
    </EditorErrorBoundary>
  )
}
