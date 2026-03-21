import type {EditorState, LexicalEditor} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import React, { useRef, useEffect } from "react";
import { CAN_PUSH_COMMAND } from '../commands'

const CAN_USE_DOM = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';

const useLayoutEffectImpl = CAN_USE_DOM ? React.useLayoutEffect : React.useEffect;
var useLayoutEffect = useLayoutEffectImpl;

export function OnChangeDebouncePlugin({
  ignoreHistoryMergeTagChange = true,
  ignoreSelectionChange = true,
  onChange,
  debounce,
}: {
  ignoreHistoryMergeTagChange?: boolean;
  ignoreSelectionChange?: boolean;
  onChange: (editor: LexicalEditor, editorState: EditorState) => void;
  debounce: number,
}): null {
  const [editor] = useLexicalComposerContext();
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useLayoutEffect(() => {
    if (onChange) {
      const unsubscribe = editor.registerUpdateListener(
        ({editorState, dirtyElements, dirtyLeaves, prevEditorState, tags}) => {
          console.log('[DEBOUNCE] Update listener fired', {
            dirtyElements: dirtyElements.size,
            dirtyLeaves: dirtyLeaves.size,
            prevEmpty: prevEditorState.isEmpty(),
            hasHistoryMerge: tags.has('history-merge'),
          });

          // Skip if nothing actually changed (only selection)
          if (ignoreSelectionChange && dirtyElements.size === 0 && dirtyLeaves.size === 0) {
            console.log('[DEBOUNCE] Skipping: only selection changed');
            return;
          }

          // Skip history-merge updates
          if (ignoreHistoryMergeTagChange && tags.has('history-merge')) {
            console.log('[DEBOUNCE] Skipping: history-merge tag');
            return;
          }

          // Skip hydration (initial content load from initialEditorState)
          if (prevEditorState.isEmpty()) {
            console.log('[DEBOUNCE] Skipping: hydration (prev empty)');
            return;
          }

          // Proceed if something changed (not selection-only, not history-merge, not hydration)
          if (dirtyElements.size > 0 || dirtyLeaves.size > 0) {
            console.log('[DEBOUNCE] Processing update, scheduling onChange callback');
            if (timerIdRef.current !== null) {
              clearTimeout(timerIdRef.current);
            }
            timerIdRef.current = setTimeout(() => {
              console.log('[DEBOUNCE] setTimeout fired, checking if mounted...');
              // Only execute if component is still mounted
              if (isMountedRef.current) {
                try {
                  console.log('[DEBOUNCE] Component mounted, executing onChange callback');
                  editor.dispatchCommand(CAN_PUSH_COMMAND, true);
                  onChange(editor, editorState);
                  console.log('[DEBOUNCE] onChange callback completed');
                } catch (error) {
                  console.error('[DEBOUNCE] Error in onChange:', error);
                }
              } else {
                console.log('[DEBOUNCE] Component not mounted, skipping onChange');
              }
            }, debounce);
          }
        },
      );

      return () => {
        // Cleanup on unmount
        isMountedRef.current = false;
        if (timerIdRef.current !== null) {
          clearTimeout(timerIdRef.current);
          timerIdRef.current = null;
        }
        unsubscribe();
      };
    }
  }, [editor, ignoreHistoryMergeTagChange, ignoreSelectionChange, onChange, debounce]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timerIdRef.current !== null) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, []);

  return null;
}
