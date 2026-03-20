import { test } from 'node:test'
import assert from 'node:assert'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { buildApp } from '../helper.ts'

test('documents: GET /documents returns list', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'documents-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    const response = await app.inject({
      method: 'GET',
      url: '/documents'
    })

    assert.strictEqual(response.statusCode, 200)
    const data = JSON.parse(response.body)
    assert(Array.isArray(data))
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})

test('documents: POST /documents creates document', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'documents-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    const response = await app.inject({
      method: 'POST',
      url: '/documents',
      payload: { name: 'Test Chapter', content: 'Hello, world!' }
    })

    assert.strictEqual(response.statusCode, 201)
    const data = JSON.parse(response.body)
    assert(data.id)
    assert.strictEqual(data.name, 'Test Chapter')
    assert(data.cid)
    assert(data.createdAt)
    assert(data.updatedAt)
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})

test('documents: GET /documents/:id retrieves document', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'documents-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    // Create a document
    const createResponse = await app.inject({
      method: 'POST',
      url: '/documents',
      payload: { name: 'Test Chapter', content: 'Hello, world!' }
    })

    assert.strictEqual(createResponse.statusCode, 201)
    const created = JSON.parse(createResponse.body)

    // Retrieve it
    const getResponse = await app.inject({
      method: 'GET',
      url: `/documents/${created.id}`
    })

    assert.strictEqual(getResponse.statusCode, 200)
    const retrieved = JSON.parse(getResponse.body)
    assert.strictEqual(retrieved.id, created.id)
    assert.strictEqual(retrieved.name, 'Test Chapter')
    assert.strictEqual(retrieved.content, 'Hello, world!')
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})

test('documents: GET /documents/:id returns 404 for missing document', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'documents-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    const response = await app.inject({
      method: 'GET',
      url: '/documents/nonexistent-id'
    })

    assert.strictEqual(response.statusCode, 404)
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})

test('documents: PUT /documents/:id updates document', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'documents-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    // Create a document
    const createResponse = await app.inject({
      method: 'POST',
      url: '/documents',
      payload: { name: 'Original', content: 'Original content' }
    })

    assert.strictEqual(createResponse.statusCode, 201)
    const created = JSON.parse(createResponse.body)

    // Update it
    const updateResponse = await app.inject({
      method: 'PUT',
      url: `/documents/${created.id}`,
      payload: { content: 'Updated content', name: 'Updated' }
    })

    assert.strictEqual(updateResponse.statusCode, 200)
    const updated = JSON.parse(updateResponse.body)
    assert.strictEqual(updated.name, 'Updated')
    assert.notStrictEqual(updated.cid, created.cid)

    // Verify content changed
    const getResponse = await app.inject({
      method: 'GET',
      url: `/documents/${created.id}`
    })

    const retrieved = JSON.parse(getResponse.body)
    assert.strictEqual(retrieved.content, 'Updated content')
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})

test('documents: PUT /documents/:id returns 404 for missing document', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'documents-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    const response = await app.inject({
      method: 'PUT',
      url: '/documents/nonexistent-id',
      payload: { content: 'test' }
    })

    assert.strictEqual(response.statusCode, 404)
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})

test('documents: DELETE /documents/:id removes document', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'documents-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    // Create a document
    const createResponse = await app.inject({
      method: 'POST',
      url: '/documents',
      payload: { name: 'Test Chapter', content: 'Hello, world!' }
    })

    assert.strictEqual(createResponse.statusCode, 201)
    const created = JSON.parse(createResponse.body)

    // Delete it
    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/documents/${created.id}`
    })

    assert.strictEqual(deleteResponse.statusCode, 204)

    // Verify it's gone
    const getResponse = await app.inject({
      method: 'GET',
      url: `/documents/${created.id}`
    })

    assert.strictEqual(getResponse.statusCode, 404)
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})

test('documents: DELETE /documents/:id returns 404 for missing document', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'documents-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    const response = await app.inject({
      method: 'DELETE',
      url: '/documents/nonexistent-id'
    })

    assert.strictEqual(response.statusCode, 404)
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})

test('documents: list returns documents sorted by updatedAt descending', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'documents-'))
  process.env.STORYLAB_DATA_DIR = tmpdir

  try {
    const app = await buildApp()

    // Create multiple documents
    const doc1Response = await app.inject({
      method: 'POST',
      url: '/documents',
      payload: { name: 'First', content: 'First content' }
    })
    const doc1 = JSON.parse(doc1Response.body)

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10))

    const doc2Response = await app.inject({
      method: 'POST',
      url: '/documents',
      payload: { name: 'Second', content: 'Second content' }
    })
    const doc2 = JSON.parse(doc2Response.body)

    // List documents
    const listResponse = await app.inject({
      method: 'GET',
      url: '/documents'
    })

    assert.strictEqual(listResponse.statusCode, 200)
    const docs = JSON.parse(listResponse.body)
    assert.strictEqual(docs.length, 2)
    // Most recently created should be first
    assert.strictEqual(docs[0].id, doc2.id)
    assert.strictEqual(docs[1].id, doc1.id)
  } finally {
    delete process.env.STORYLAB_DATA_DIR
    rmSync(tmpdir, { recursive: true })
  }
})
