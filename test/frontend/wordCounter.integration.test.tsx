import { describe, it, expect } from 'vitest'
import { countWordsFromLexical } from '../../src/utils/wordCount'

describe('Word Counter — Integration Tests', () => {
  describe('List handling (BUG FIX)', () => {
    it('should correctly count 5 list items as 5 words, not 1', () => {
      // This is the exact bug reported: a list of 5 elements was counted as 1 word
      const lexicalState = {
        root: {
          children: [
            {
              type: 'list',
              listType: 'bullet',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'First' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Second' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Third' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Fourth' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Fifth' }] }
              ]
            }
          ],
          version: 1,
          type: 'root'
        }
      }

      const wordCount = countWordsFromLexical(lexicalState)
      expect(wordCount).toBe(5)
    })
  })

  describe('Line break handling (BUG FIX)', () => {
    it('should count words after Shift+Enter line break', () => {
      // This is the second bug: words after line breaks weren't counted
      const lexicalState = {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'First' },
                { type: 'linebreak' },
                { type: 'text', text: 'Second' },
                { type: 'linebreak' },
                { type: 'text', text: 'Third' }
              ]
            }
          ],
          version: 1,
          type: 'root'
        }
      }

      const wordCount = countWordsFromLexical(lexicalState)
      // All three words should be counted despite line breaks
      expect(wordCount).toBe(3)
    })
  })

  describe('Complex document scenarios', () => {
    it('should handle mixed content: paragraphs + lists + line breaks', () => {
      const complexState = {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'Introduction paragraph' }
              ]
            },
            {
              type: 'list',
              listType: 'bullet',
              children: [
                {
                  type: 'listitem',
                  children: [
                    { type: 'text', text: 'Point one' },
                    { type: 'linebreak' },
                    { type: 'text', text: 'continued' }
                  ]
                },
                {
                  type: 'listitem',
                  children: [{ type: 'text', text: 'Point two' }]
                }
              ]
            },
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'Conclusion' }
              ]
            }
          ],
          version: 1,
          type: 'root'
        }
      }

      const wordCount = countWordsFromLexical(complexState)
      // Introduction(2) + Point(1) one(1) continued(1) + Point(1) two(1) + Conclusion(1) = 8 words
      expect(wordCount).toBe(8)
    })

    it('should handle numbered lists with line breaks', () => {
      const numberedListState = {
        root: {
          children: [
            {
              type: 'list',
              listType: 'number',
              children: [
                {
                  type: 'listitem',
                  children: [
                    { type: 'text', text: 'First' },
                    { type: 'linebreak' },
                    { type: 'text', text: 'line' }
                  ]
                },
                {
                  type: 'listitem',
                  children: [
                    { type: 'text', text: 'Second' },
                    { type: 'linebreak' },
                    { type: 'text', text: 'line' }
                  ]
                }
              ]
            }
          ],
          version: 1,
          type: 'root'
        }
      }

      const wordCount = countWordsFromLexical(numberedListState)
      // First(1) line(1) Second(1) line(1) = 4 words
      expect(wordCount).toBe(4)
    })
  })

  describe('Serialisation compatibility', () => {
    it('should handle JSON string input (from Lexical serialisation)', () => {
      const stateJson = JSON.stringify({
        root: {
          children: [
            {
              type: 'list',
              listType: 'bullet',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Item' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Item' }] }
              ]
            }
          ],
          version: 1,
          type: 'root'
        }
      })

      const wordCount = countWordsFromLexical(stateJson)
      expect(wordCount).toBe(2)
    })
  })
})
