import { describe, it, expect } from 'vitest'
import { extractTextFromLexical, countWordsFromLexical } from '../../src/utils/wordCount'

describe('Word Counter', () => {
  describe('countWordsFromLexical — basic counting', () => {
    it('should count words in a simple paragraph', () => {
      const state = {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'Hello world' }
              ]
            }
          ]
        }
      }
      expect(countWordsFromLexical(state)).toBe(2)
    })

    it('should count 0 words in empty editor', () => {
      const state = {
        root: {
          children: [
            {
              type: 'paragraph',
              children: []
            }
          ]
        }
      }
      expect(countWordsFromLexical(state)).toBe(0)
    })

    it('should parse JSON strings', () => {
      const stateString = JSON.stringify({
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'Test word count' }
              ]
            }
          ]
        }
      })
      expect(countWordsFromLexical(stateString)).toBe(3)
    })
  })

  describe('countWordsFromLexical — bullet lists (BUG FIX)', () => {
    it('should count 5 items in a bullet list as 5 words (not 1)', () => {
      const state = {
        root: {
          children: [
            {
              type: 'list',
              listType: 'bullet',
              children: [
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Item' }]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Item' }]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Item' }]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Item' }]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Item' }]
                }
              ]
            }
          ]
        }
      }
      expect(countWordsFromLexical(state)).toBe(5)
    })

    it('should count words in list items with multiple words each', () => {
      const state = {
        root: {
          children: [
            {
              type: 'list',
              listType: 'bullet',
              children: [
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'First item' }]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Second item' }]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Third item' }]
                }
              ]
            }
          ]
        }
      }
      // Each list item is separate: "First item", "Second item", "Third item" = 6 words total
      expect(countWordsFromLexical(state)).toBe(6)
    })

    it('should count words in numbered lists', () => {
      const state = {
        root: {
          children: [
            {
              type: 'list',
              listType: 'number',
              children: [
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'one' }]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'two' }]
                }
              ]
            }
          ]
        }
      }
      expect(countWordsFromLexical(state)).toBe(2)
    })
  })

  describe('countWordsFromLexical — line breaks (BUG FIX)', () => {
    it('should count words correctly with Shift+Enter line break', () => {
      const state = {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'Line' },
                { type: 'linebreak' },
                { type: 'text', text: 'Break' }
              ]
            }
          ]
        }
      }
      // "Line Break" = 2 words (line break acts as separator)
      expect(countWordsFromLexical(state)).toBe(2)
    })

    it('should count multiple line breaks correctly', () => {
      const state = {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'Word1' },
                { type: 'linebreak' },
                { type: 'text', text: 'Word2' },
                { type: 'linebreak' },
                { type: 'text', text: 'Word3' }
              ]
            }
          ]
        }
      }
      // "Word1 Word2 Word3" = 3 words
      expect(countWordsFromLexical(state)).toBe(3)
    })

    it('should count words in list item with line breaks', () => {
      const state = {
        root: {
          children: [
            {
              type: 'list',
              listType: 'bullet',
              children: [
                {
                  type: 'listitem',
                  children: [
                    { type: 'text', text: 'First' },
                    { type: 'linebreak' },
                    { type: 'text', text: 'continued' }
                  ]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Second' }]
                }
              ]
            }
          ]
        }
      }
      // "First continued Second" = 3 words
      expect(countWordsFromLexical(state)).toBe(3)
    })
  })

  describe('countWordsFromLexical — nested structures', () => {
    it('should count words in nested lists', () => {
      const state = {
        root: {
          children: [
            {
              type: 'list',
              listType: 'bullet',
              children: [
                {
                  type: 'listitem',
                  children: [
                    { type: 'text', text: 'Parent' },
                    {
                      type: 'list',
                      listType: 'bullet',
                      children: [
                        {
                          type: 'listitem',
                          children: [{ type: 'text', text: 'Child' }]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
      // "Parent Child" = 2 words
      expect(countWordsFromLexical(state)).toBe(2)
    })

    it('should count words across multiple paragraphs and lists', () => {
      const state = {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Introduction' }]
            },
            {
              type: 'list',
              listType: 'bullet',
              children: [
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'First' }]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Second' }]
                }
              ]
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Conclusion' }]
            }
          ]
        }
      }
      // "Introduction First Second Conclusion" = 4 words
      expect(countWordsFromLexical(state)).toBe(4)
    })
  })

  describe('extractTextFromLexical — text extraction', () => {
    it('should extract text from simple paragraph', () => {
      const node = {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Hello world' }]
      }
      const text = extractTextFromLexical(node)
      expect(text).toContain('Hello')
      expect(text).toContain('world')
    })

    it('should preserve spaces between list items', () => {
      const node = {
        type: 'list',
        listType: 'bullet',
        children: [
          {
            type: 'listitem',
            children: [{ type: 'text', text: 'First' }]
          },
          {
            type: 'listitem',
            children: [{ type: 'text', text: 'Second' }]
          }
        ]
      }
      const text = extractTextFromLexical(node)
      // Should have space between items
      expect(text).toMatch(/First.*\s+.*Second/)
    })

    it('should treat line breaks as spaces', () => {
      const node = {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Hello' },
          { type: 'linebreak' },
          { type: 'text', text: 'world' }
        ]
      }
      const text = extractTextFromLexical(node)
      // Line break should be converted to space
      expect(text).toMatch(/Hello.*\s.*world/)
    })
  })

  describe('edge cases', () => {
    it('should handle empty list', () => {
      const state = {
        root: {
          children: [
            {
              type: 'list',
              listType: 'bullet',
              children: []
            }
          ]
        }
      }
      expect(countWordsFromLexical(state)).toBe(0)
    })

    it('should handle text with extra whitespace', () => {
      const state = {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'Hello    world' }
              ]
            }
          ]
        }
      }
      expect(countWordsFromLexical(state)).toBe(2)
    })

    it('should handle invalid JSON gracefully', () => {
      expect(countWordsFromLexical('not valid json')).toBe(0)
    })

    it('should handle list items with multiple text nodes', () => {
      const state = {
        root: {
          children: [
            {
              type: 'list',
              listType: 'bullet',
              children: [
                {
                  type: 'listitem',
                  children: [
                    { type: 'text', text: 'Bold ' },
                    { type: 'text', text: 'text' }
                  ]
                }
              ]
            }
          ]
        }
      }
      expect(countWordsFromLexical(state)).toBe(2)
    })
  })
})
