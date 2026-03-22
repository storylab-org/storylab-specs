import { test } from 'node:test'
import * as assert from 'node:assert'
import { lexicalToMarkdown } from '../../server/dist/lexical-to-markdown.js'

test('lexicalToMarkdown converter', async (t) => {
  await t.test('converts paragraph nodes', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Hello world' }],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.strictEqual(md, 'Hello world')
  })

  await t.test('converts heading nodes with correct markdown', () => {
    const json = JSON.stringify({
      root: {
        children: [
          { type: 'heading', tag: 'h1', children: [{ type: 'text', text: 'Title' }] },
          { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Subtitle' }] },
          { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'Section' }] },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('# Title'))
    assert.ok(md.includes('## Subtitle'))
    assert.ok(md.includes('### Section'))
  })

  await t.test('applies text formatting (bold, italic, code)', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'normal', format: 0 },
              { type: 'text', text: 'bold', format: 1 },
              { type: 'text', text: 'italic', format: 2 },
              { type: 'text', text: 'code', format: 16 },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('normal'))
    assert.ok(md.includes('**bold**'))
    assert.ok(md.includes('_italic_'))
    assert.ok(md.includes('`code`'))
  })

  await t.test('converts blockquote nodes', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'quote',
            children: [{ type: 'text', text: 'This is a quote' }],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('> This is a quote'))
  })

  await t.test('converts code blocks with fencing', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'code',
            children: [{ type: 'text', text: 'const x = 42;' }],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('```'))
    assert.ok(md.includes('const x = 42;'))
  })

  await t.test('converts bullet lists', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'list',
            listType: 'bullet',
            children: [
              { type: 'listitem', children: [{ type: 'text', text: 'Item 1' }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Item 2' }] },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('- Item 1'))
    assert.ok(md.includes('- Item 2'))
  })

  await t.test('converts numbered lists', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'list',
            listType: 'number',
            children: [
              { type: 'listitem', children: [{ type: 'text', text: 'First' }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Second' }] },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('1. First'))
    assert.ok(md.includes('1. Second'))
  })

  await t.test('escapes markdown special characters', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'text with *asterisks* and _underscores_' }],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('\\*'))
    assert.ok(md.includes('\\_'))
  })

  await t.test('handles linebreak nodes', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'Line 1' },
              { type: 'linebreak' },
              { type: 'text', text: 'Line 2' },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('Line 1'))
    assert.ok(md.includes('Line 2'))
  })

  await t.test('handles invalid JSON gracefully', () => {
    const md = lexicalToMarkdown('invalid json')
    assert.strictEqual(md, '')
  })

  await t.test('converts horizontal rule', () => {
    const json = JSON.stringify({
      root: {
        children: [{ type: 'horizontalrule' }],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('---'))
  })

  await t.test('handles multiple paragraphs with separation', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Paragraph 1' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Paragraph 2' }],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('Paragraph 1'))
    assert.ok(md.includes('Paragraph 2'))
    // Should have double newline separation
    const parts = md.split('\n\n')
    assert.ok(parts.length >= 2)
  })

  await t.test('handles nested list items with indentation', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'list',
            listType: 'bullet',
            children: [
              { type: 'listitem', children: [{ type: 'text', text: 'Item 1' }] },
              {
                type: 'listitem',
                children: [
                  { type: 'text', text: 'Item 2' },
                  {
                    type: 'list',
                    listType: 'bullet',
                    children: [{ type: 'listitem', children: [{ type: 'text', text: 'Nested' }] }],
                  },
                ],
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const md = lexicalToMarkdown(json)
    assert.ok(md.includes('- Item 1'))
    assert.ok(md.includes('- Item 2'))
    assert.ok(md.includes('Nested'))
  })
})
