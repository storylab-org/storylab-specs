import { test } from 'node:test'
import * as assert from 'node:assert'
import { buildApp } from '../helper.ts'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'

test('export routes', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'export-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    // Create some test documents via HTTP API
    await app.inject({
      method: 'POST',
      url: '/documents',
      payload: {
        name: 'Chapter 1',
        content: JSON.stringify({
          root: {
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'This is chapter one.' }],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        }),
      },
    })

    await app.inject({
      method: 'POST',
      url: '/documents',
      payload: {
        name: 'Chapter 2',
        content: JSON.stringify({
          root: {
            children: [
              {
                type: 'heading',
                tag: 'h2',
                children: [{ type: 'text', text: 'Section', format: 1 }],
              },
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Content here.' }],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        }),
      },
    })

    await t.test('GET /export/epub returns valid EPUB file', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/export/epub',
      })

      assert.strictEqual(response.statusCode, 200, 'should return 200')
      assert.strictEqual(
        response.headers['content-type'],
        'application/epub+zip',
        'should have epub content type'
      )
      assert.ok(response.rawPayload.length > 0, 'should return non-empty payload')
      assert.strictEqual(
        response.headers['content-disposition'],
        'attachment; filename="book.epub"',
        'should have download header'
      )

      // Verify it's a valid ZIP (starts with PK signature)
      assert.strictEqual(response.rawPayload[0], 0x50, 'should start with P (ZIP signature)')
      assert.strictEqual(response.rawPayload[1], 0x4b, 'should start with K (ZIP signature)')
    })

    await t.test('GET /export/html returns valid HTML file', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/export/html',
      })

      assert.strictEqual(response.statusCode, 200, 'should return 200')
      assert.strictEqual(response.headers['content-type'], 'text/html', 'should have html content type')
      assert.ok(response.payload.includes('<h1>'), 'should contain HTML heading')
      assert.ok(response.payload.includes('Chapter 1'), 'should contain chapter title')
      assert.ok(response.payload.includes('Table of Contents'), 'should have TOC')
      assert.strictEqual(
        response.headers['content-disposition'],
        'attachment; filename="book.html"',
        'should have download header'
      )
    })

    await t.test('GET /export/markdown returns valid Markdown file', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/export/markdown',
      })

      assert.strictEqual(response.statusCode, 200, 'should return 200')
      assert.strictEqual(response.headers['content-type'], 'text/markdown', 'should have markdown type')
      assert.ok(response.payload.includes('# Chapter 1'), 'should contain chapter heading')
      assert.ok(response.payload.includes('This is chapter one'), 'should contain chapter content')
      assert.ok(response.payload.includes('## **Section**'), 'should contain formatted heading')
      assert.strictEqual(
        response.headers['content-disposition'],
        'attachment; filename="book.md"',
        'should have download header'
      )
    })

    await t.test('export routes handle empty document store gracefully', async () => {
      const emptyTmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'export-empty-'))
      process.env.STORYLAB_DATA_DIR = emptyTmpdir

      try {
        const emptyApp = await buildApp()

        const epubResponse = await emptyApp.inject({
          method: 'GET',
          url: '/export/epub',
        })
        assert.strictEqual(epubResponse.statusCode, 400, 'should return 400 for empty EPUB')

        const htmlResponse = await emptyApp.inject({
          method: 'GET',
          url: '/export/html',
        })
        assert.strictEqual(htmlResponse.statusCode, 400, 'should return 400 for empty HTML')

        const mdResponse = await emptyApp.inject({
          method: 'GET',
          url: '/export/markdown',
        })
        assert.strictEqual(mdResponse.statusCode, 400, 'should return 400 for empty Markdown')

        await emptyApp.close()
      } finally {
        delete process.env.STORYLAB_DATA_DIR
        rmSync(emptyTmpdir, { recursive: true })
      }
    })

    await app.close()
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})
