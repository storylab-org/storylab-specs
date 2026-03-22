/**
 * Calculates word count from Lexical editor state JSON
 * Handles lists and line breaks correctly
 */

export interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
  [key: string]: any;
}

/**
 * Extract text content from Lexical JSON state, preserving word boundaries
 * Handles:
 * - List items (separated by spaces)
 * - Line breaks (treated as word separators)
 * - Nested structures
 */
export function extractTextFromLexical(node: LexicalNode): string {
  if (!node) return '';

  if (node.type === 'text') {
    return node.text || '';
  }

  if (node.type === 'linebreak') {
    // Line breaks act as word separators
    return ' ';
  }

  if (node.type === 'listitem') {
    // List items: join children with spaces to separate different node types, add trailing space for next block
    if (node.children && Array.isArray(node.children)) {
      const text = node.children.map(extractTextFromLexical).join(' ');
      return text ? text + ' ' : '';
    }
    return '';
  }

  if (node.type === 'paragraph' || node.type === 'heading' || node.type === 'quote') {
    // Block-level elements: join children, add trailing space
    if (node.children && Array.isArray(node.children)) {
      const text = node.children.map(extractTextFromLexical).join('');
      return text ? text + ' ' : '';
    }
    return '';
  }

  // For container node types (list, root, etc.), join children with spaces
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextFromLexical).join(' ');
  }

  return '';
}

/**
 * Count words in Lexical editor state
 * Properly handles lists, line breaks, and other block elements
 */
export function countWordsFromLexical(editorState: LexicalNode | string): number {
  let state: LexicalNode;

  // Parse if string
  if (typeof editorState === 'string') {
    try {
      state = JSON.parse(editorState);
    } catch {
      return 0;
    }
  } else {
    state = editorState;
  }

  // If state has a root property, use that (common Lexical structure)
  const nodeToExtract = (state as any).root || state;

  // Extract text preserving word boundaries
  const text = extractTextFromLexical(nodeToExtract);

  // Split by whitespace and filter empty strings
  const words = text.split(/\s+/).filter(Boolean);

  return words.length;
}
