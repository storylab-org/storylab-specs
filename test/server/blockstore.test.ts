import { test } from 'node:test'
import assert from 'node:assert'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { createBlockstore } from '../../server/dist/blockstore.js'

test('blockstore: put and get round-trip', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'blockstore-'))
  try {
    const blockstore = createBlockstore(tmpdir)
    const data = new TextEncoder().encode('hello world')

    const cid = await blockstore.put(data)
    assert(typeof cid === 'string')
    assert(cid.length === 64) // SHA-256 hex is 64 chars

    const retrieved = await blockstore.get(cid)
    assert.deepStrictEqual(retrieved, data)
  } finally {
    rmSync(tmpdir, { recursive: true })
  }
})

test('blockstore: put is idempotent', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'blockstore-'))
  try {
    const blockstore = createBlockstore(tmpdir)
    const data = new TextEncoder().encode('hello world')

    const cid1 = await blockstore.put(data)
    const cid2 = await blockstore.put(data)
    assert.strictEqual(cid1, cid2)

    const retrieved = await blockstore.get(cid1)
    assert.deepStrictEqual(retrieved, data)
  } finally {
    rmSync(tmpdir, { recursive: true })
  }
})

test('blockstore: different content → different CID', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'blockstore-'))
  try {
    const blockstore = createBlockstore(tmpdir)
    const data1 = new TextEncoder().encode('hello')
    const data2 = new TextEncoder().encode('world')

    const cid1 = await blockstore.put(data1)
    const cid2 = await blockstore.put(data2)
    assert.notStrictEqual(cid1, cid2)
  } finally {
    rmSync(tmpdir, { recursive: true })
  }
})

test('blockstore: has returns true for existing block', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'blockstore-'))
  try {
    const blockstore = createBlockstore(tmpdir)
    const data = new TextEncoder().encode('hello world')

    const cid = await blockstore.put(data)
    const exists = await blockstore.has(cid)
    assert.strictEqual(exists, true)
  } finally {
    rmSync(tmpdir, { recursive: true })
  }
})

test('blockstore: has returns false for missing block', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'blockstore-'))
  try {
    const blockstore = createBlockstore(tmpdir)
    const fakeCid = '0'.repeat(64)

    const exists = await blockstore.has(fakeCid)
    assert.strictEqual(exists, false)
  } finally {
    rmSync(tmpdir, { recursive: true })
  }
})

test('blockstore: delete removes block', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'blockstore-'))
  try {
    const blockstore = createBlockstore(tmpdir)
    const data = new TextEncoder().encode('hello world')

    const cid = await blockstore.put(data)
    assert(await blockstore.has(cid))

    await blockstore.delete(cid)
    assert(!(await blockstore.has(cid)))
  } finally {
    rmSync(tmpdir, { recursive: true })
  }
})

test('blockstore: getAll returns all blocks', async (t) => {
  const tmpdir = mkdtempSync(join(process.env.TMPDIR || '/tmp', 'blockstore-'))
  try {
    const blockstore = createBlockstore(tmpdir)
    const data1 = new TextEncoder().encode('hello')
    const data2 = new TextEncoder().encode('world')
    const data3 = new TextEncoder().encode('test')

    const cid1 = await blockstore.put(data1)
    const cid2 = await blockstore.put(data2)
    const cid3 = await blockstore.put(data3)

    const blocks: Array<{ cid: string; data: Uint8Array }> = []
    for await (const block of blockstore.getAll()) {
      blocks.push(block)
    }

    assert.strictEqual(blocks.length, 3)

    const cids = new Set(blocks.map((b) => b.cid))
    assert(cids.has(cid1))
    assert(cids.has(cid2))
    assert(cids.has(cid3))
  } finally {
    rmSync(tmpdir, { recursive: true })
  }
})
