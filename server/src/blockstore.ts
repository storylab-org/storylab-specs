import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, stat, readdir, unlink } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

export type CID = string // SHA-256 hex string

export interface Blockstore {
  put(data: Uint8Array): Promise<CID>
  get(cid: CID): Promise<Uint8Array>
  has(cid: CID): Promise<boolean>
  delete(cid: CID): Promise<void>
  getAll(): AsyncGenerator<{ cid: CID; data: Uint8Array }>
}

function cidFromData(data: Uint8Array): CID {
  return createHash('sha256').update(data).digest('hex')
}

function cidToPath(blocksRoot: string, cid: CID): string {
  const prefix = cid.slice(0, 2)
  const suffix = cid.slice(2)
  return join(blocksRoot, prefix, suffix)
}

export function createBlockstore(blocksRoot?: string): Blockstore {
  const root = blocksRoot ?? join(homedir(), '.storylab', 'blocks')

  const put = async (data: Uint8Array): Promise<CID> => {
    const cid = cidFromData(data)
    const path = cidToPath(root, cid)

    // Check if already exists (idempotent)
    const exists = await has(cid)
    if (exists) {
      return cid
    }

    // Create parent directory
    const prefix = cid.slice(0, 2)
    await mkdir(join(root, prefix), { recursive: true })

    // Write block
    await writeFile(path, data)
    return cid
  }

  const get = async (cid: CID): Promise<Uint8Array> => {
    const path = cidToPath(root, cid)
    const buffer = await readFile(path)
    return new Uint8Array(buffer)
  }

  const has = async (cid: CID): Promise<boolean> => {
    const path = cidToPath(root, cid)
    try {
      await stat(path)
      return true
    } catch {
      return false
    }
  }

  const deleteBlock = async (cid: CID): Promise<void> => {
    const path = cidToPath(root, cid)
    await unlink(path)
  }

  const getAll = async function* (): AsyncGenerator<{ cid: CID; data: Uint8Array }> {
    const prefixes = await readdir(root)
    for (const prefix of prefixes) {
      if (prefix.length !== 2) continue

      const prefixPath = join(root, prefix)
      const suffixes = await readdir(prefixPath)
      for (const suffix of suffixes) {
        const cid = (prefix + suffix) as CID
        const data = await get(cid)
        yield { cid, data }
      }
    }
  }

  return {
    put,
    get,
    has,
    delete: deleteBlock,
    getAll
  }
}
