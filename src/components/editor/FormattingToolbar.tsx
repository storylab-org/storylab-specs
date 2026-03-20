import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical'
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
} from 'lucide-react'
import './FormattingToolbar.css'

export default function FormattingToolbar() {
  const [editor] = useLexicalComposerContext()

  const handleFormat = (command: string, arg?: string) => {
    editor.dispatchCommand(command as any, arg as any)
  }

  return (
    <div className="formatting-toolbar">
      <button
        title="Undo (Ctrl+Z)"
        onClick={() => handleFormat(UNDO_COMMAND)}
        className="format-btn"
      >
        <Undo2 size={16} />
      </button>

      <button
        title="Redo (Ctrl+Y)"
        onClick={() => handleFormat(REDO_COMMAND)}
        className="format-btn"
      >
        <Redo2 size={16} />
      </button>

      <div className="separator" />

      <button
        title="Bold (Ctrl+B)"
        onClick={() => handleFormat(FORMAT_TEXT_COMMAND, 'bold')}
        className="format-btn"
      >
        <Bold size={16} />
      </button>

      <button
        title="Italic (Ctrl+I)"
        onClick={() => handleFormat(FORMAT_TEXT_COMMAND, 'italic')}
        className="format-btn"
      >
        <Italic size={16} />
      </button>

      <button
        title="Underline (Ctrl+U)"
        onClick={() => handleFormat(FORMAT_TEXT_COMMAND, 'underline')}
        className="format-btn"
      >
        <Underline size={16} />
      </button>

      <div className="separator" />

      <button
        title="Bullet List"
        onClick={() => handleFormat(INSERT_UNORDERED_LIST_COMMAND)}
        className="format-btn"
      >
        <List size={16} />
      </button>

      <button
        title="Numbered List"
        onClick={() => handleFormat(INSERT_ORDERED_LIST_COMMAND)}
        className="format-btn"
      >
        <ListOrdered size={16} />
      </button>

      <div className="separator" />

      <button
        title="Align Left"
        onClick={() => handleFormat(FORMAT_ELEMENT_COMMAND, 'left')}
        className="format-btn"
      >
        <AlignLeft size={16} />
      </button>

      <button
        title="Align Center"
        onClick={() => handleFormat(FORMAT_ELEMENT_COMMAND, 'center')}
        className="format-btn"
      >
        <AlignCenter size={16} />
      </button>

      <button
        title="Align Right"
        onClick={() => handleFormat(FORMAT_ELEMENT_COMMAND, 'right')}
        className="format-btn"
      >
        <AlignRight size={16} />
      </button>
    </div>
  )
}
