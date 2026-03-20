import React, { useEffect, useState } from 'react';
import './lexical/style.css';

import type { EditorState, LexicalEditor as LexicalEditorType } from 'lexical';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';

import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import AutoLinkPlugin from './lexical/plugins/AutoLinkPlugin';
import TreeViewPlugin from './lexical/plugins/TreeViewPlugin';
import FormattingToolbar from './FormattingToolbar';
// ToolbarPlugin removed - causes "Unable to find active editor" errors on chapter switch

import PlaygroundEditorTheme from './lexical/themes/PlaygroundEditorTheme';

interface LexicalEditorProps {
  chapterId: string;
  initialContent?: string;
  language?: string;
  onContentChange?: (serialisedState: string, wordCount: number) => void;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({
  chapterId,
  initialContent,
  language = 'en',
  onContentChange,
}) => {
  const [wordCount, setWordCount] = useState<number>(0);
  const theme = PlaygroundEditorTheme;

  function onChange(editorState: EditorState, _editor: LexicalEditorType, tags: Set<string>) {
    // Immediately serialise and report state changes
    const serialisedState = JSON.stringify(editorState.toJSON());
    const isInitialisation = tags.has('hydration');
    console.log(
      `[LEXICAL] Editor state changed ${isInitialisation ? '(init)' : '(user edit)'}: ${serialisedState.length} bytes`
    );
    if (onContentChange) {
      onContentChange(serialisedState, wordCount);
    }
  }

  function WordCountPlugin(): React.ReactElement | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      return editor.registerTextContentListener((textContent) => {
        // Count words - use simple split fallback
        const wordCount = textContent.split(/\s+/).filter(Boolean).length;
        setWordCount(wordCount);
      });
    }, [editor, language]);

    return (
      <div className="word-counter">
        {wordCount.toLocaleString(language)} words
      </div>
    );
  }


  function Placeholder() {
    return <div className="editor-placeholder">Empty document ...</div>;
  }

  function onError(error: any) {
    console.error(error);
  }

  let initialEditorState: string | undefined = undefined;
  if (initialContent) {
    try {
      const parsed = JSON.parse(initialContent);
      initialEditorState = JSON.stringify(parsed);
      console.log(`[LEXICAL] Parsed initialContent: ${initialContent.length} bytes → ${initialEditorState.length} bytes`);
    } catch (error) {
      console.error(`[LEXICAL] Failed to parse initialContent:`, error);
    }
  } else {
    console.log(`[LEXICAL] No initialContent provided`);
  }

  return (
    <LexicalComposer
      key={chapterId}
      initialConfig={{
        namespace: chapterId,
        editorState: initialEditorState,
        nodes: [
          HeadingNode,
          ListNode,
          ListItemNode,
          QuoteNode,
          CodeNode,
          CodeHighlightNode,
          TableNode,
          TableCellNode,
          TableRowNode,
          AutoLinkNode,
          LinkNode,
        ],
        theme,
        onError,
      }}
    >
      <FormattingToolbar />
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <TreeViewPlugin />
      </div>
      <WordCountPlugin />
    </LexicalComposer>
  );
};

export default LexicalEditor;
