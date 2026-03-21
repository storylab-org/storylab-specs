/**
 * Plugin that intercepts link clicks and shows a confirmation dialog
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CLICK_COMMAND } from 'lexical';
import { useEffect } from 'react';
import useModal from '../../hooks/useModal';

export default function LinkClickPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [modal, showModal] = useModal();

  useEffect(() => {
    return editor.registerCommand(
      CLICK_COMMAND,
      (payload: PointerEvent) => {
        const target = payload.target as HTMLElement;

        // Check if the clicked element is a link
        let linkElement: HTMLAnchorElement | null = null;
        if (target.tagName === 'A') {
          linkElement = target as HTMLAnchorElement;
        } else {
          linkElement = target.closest('a') as HTMLAnchorElement;
        }

        if (!linkElement) return false;

        const href = linkElement.getAttribute('href');
        if (!href) return false;

        // Prevent default link behaviour
        payload.preventDefault();

        // Show confirmation dialog
        showModal('Open Link', (onClose: () => void) => (
          <div style={{ padding: '16px', fontSize: '14px' }}>
            <p>Do you want to open this link?</p>
            <p style={{ wordBreak: 'break-all', color: '#666', fontSize: '12px', marginTop: '8px' }}>
              {href}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => {
                  window.open(href, '_blank', 'noopener,noreferrer');
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Open
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: '#f5f5f5',
                  color: '#1a1a1a',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ));

        return true;
      },
      1
    );
  }, [editor, showModal]);

  return modal;
}
