import { useState } from 'react';
import { Save, Download } from 'lucide-react';
import './EditorToolbar.css';

interface EditorToolbarProps {
  chapterId?: string;
  chapterTitle?: string;
  onSave?: () => void;
  onExport?: (format: 'markdown' | 'html' | 'pdf') => void;
  isSaving?: boolean;
  wordCount?: number;
}

export default function EditorToolbar({
  chapterId,
  chapterTitle = 'Untitled',
  onSave,
  onExport,
  isSaving = false,
  wordCount = 0,
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
                  onExport?.('pdf');
                  setExportMenuOpen(false);
                }}
              >
                PDF (coming soon)
              </button>
            </div>
          )}
        </div>

        <button
          className={`toolbar-button toolbar-button-primary ${isSaving ? 'saving' : ''}`}
          onClick={onSave}
          disabled={isSaving}
          aria-label="Save document"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
