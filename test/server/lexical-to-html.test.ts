import { test } from 'node:test'
import * as assert from 'node:assert'
import { lexicalToHtml } from '../../server/dist/lexical-to-html.js'

test('lexicalToHtml converter', async (t) => {
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
    const html = lexicalToHtml(json)
    assert.strictEqual(html, '<p>Hello world</p>')
  })

  await t.test('converts heading nodes with correct tags', () => {
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
    const html = lexicalToHtml(json)
    assert.ok(html.includes('<h1>Title</h1>'))
    assert.ok(html.includes('<h2>Subtitle</h2>'))
    assert.ok(html.includes('<h3>Section</h3>'))
  })

  await t.test('applies text formatting (bold, italic, underline, code)', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'normal', format: 0 },
              { type: 'text', text: 'bold', format: 1 },
              { type: 'text', text: 'italic', format: 2 },
              { type: 'text', text: 'bold italic', format: 3 },
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
    const html = lexicalToHtml(json)
    assert.ok(html.includes('normal'))
    assert.ok(html.includes('<strong>bold</strong>'))
    assert.ok(html.includes('<em>italic</em>'))
    assert.ok(html.includes('<strong><em>bold italic</em></strong>'))
    assert.ok(html.includes('<code>code</code>'))
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
    const html = lexicalToHtml(json)
    assert.strictEqual(html, '<blockquote>This is a quote</blockquote>')
  })

  await t.test('converts code blocks', () => {
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
    const html = lexicalToHtml(json)
    assert.ok(html.includes('<pre><code>'))
    assert.ok(html.includes('const x = 42;'))
    assert.ok(html.includes('</code></pre>'))
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
    const html = lexicalToHtml(json)
    assert.ok(html.includes('<ul>'))
    assert.ok(html.includes('<li>Item 1</li>'))
    assert.ok(html.includes('<li>Item 2</li>'))
    assert.ok(html.includes('</ul>'))
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
    const html = lexicalToHtml(json)
    assert.ok(html.includes('<ol>'))
    assert.ok(html.includes('<li>First</li>'))
    assert.ok(html.includes('<li>Second</li>'))
    assert.ok(html.includes('</ol>'))
  })

  await t.test('escapes HTML entities in text', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: '<script>alert("xss")</script>' }],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })
    const html = lexicalToHtml(json)
    assert.ok(!html.includes('<script>'))
    assert.ok(html.includes('&lt;script&gt;'))
    assert.ok(html.includes('&lt;/script&gt;'))
  })

  await t.test('handles colored text nodes', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'colored',
                text: 'red text',
                color: '#FF0000',
                format: 0,
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
    const html = lexicalToHtml(json)
    assert.ok(html.includes('<span style="color:#FF0000"'))
    assert.ok(html.includes('red text'))
    assert.ok(html.includes('</span>'))
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
    const html = lexicalToHtml(json)
    assert.ok(html.includes('Line 1'))
    assert.ok(html.includes('<br/>'))
    assert.ok(html.includes('Line 2'))
  })

  await t.test('handles invalid JSON gracefully', () => {
    const html = lexicalToHtml('invalid json')
    assert.strictEqual(html, '')
  })

  await t.test('handles nested formatting', () => {
    const json = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'formatted',
                format: 3, // bold (1) + italic (2)
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
    const html = lexicalToHtml(json)
    assert.ok(html.includes('<strong><em>formatted</em></strong>'))
  })
})
