import { useState } from 'react';
import { Check, Download, AlertCircle, Save } from 'lucide-react';
import './EditorToolbar.css';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface EditorToolbarProps {
  chapterId?: string;
  chapterTitle?: string;
  onExport?: (format: 'markdown' | 'html' | 'epub' | 'pdf') => void;
  onSave?: () => void;
  saveStatus?: SaveStatus;
}

export default function EditorToolbar({
  chapterId,
  chapterTitle = 'Untitled',
  onExport,
  onSave,
  saveStatus = 'idle',
}: EditorToolbarProps) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  return (
    <div className="editor-toolbar">
      <div className="toolbar-section toolbar-left">
        <div className="chapter-info">
          <h2 className="chapter-title">{chapterTitle}</h2>
          {chapterId && <span className="chapter-id">Chapter {chapterId}</span>}
        </div>
      </div>

      <div className="toolbar-section toolbar-right">
        <button
          className="toolbar-button toolbar-button-primary"
          onClick={onSave}
          disabled={saveStatus === 'saving'}
          aria-label="Save chapter"
        >
          {saveStatus === 'saving' && <Save size={18} />}
          {saveStatus === 'saved' && <Check size={18} />}
          {saveStatus === 'error' && <AlertCircle size={18} />}
          {saveStatus === 'idle' && <Save size={18} />}

          {saveStatus === 'saving' && 'Saving…'}
          {saveStatus === 'saved' && 'Saved'}
          {saveStatus === 'error' && 'Save failed'}
          {saveStatus === 'idle' && 'Save'}
        </button>

        <div className="export-menu-container">
          <button
            className="toolbar-button toolbar-button-secondary"
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            aria-label="Export document"
          >
            <Download size={18} />
            Export
          </button>
          {exportMenuOpen && (
            <div className="export-menu">
              <button
                className="export-menu-item"
                onClick={() => {
                  onExport?.('markdown');
                  setExportMenuOpen(false);
                }}
              >
                Markdown
              </button>
              <button
                className="export-menu-item"
                onClick={() => {
                  onExport?.('html');
                  setExportMenuOpen(false);
                }}
              >
                HTML
              </button>
              <button
                className="export-menu-item"
                onClick={() => {
                  onExport?.('epub');
                  setExportMenuOpen(false);
                }}
              >
                EPUB
              </button>
              <button
                className="export-menu-item"
                onClick={() => {
                  onExport?.('pdf');
                  setExportMenuOpen(false);
                }}
              >
                PDF (coming soon)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
