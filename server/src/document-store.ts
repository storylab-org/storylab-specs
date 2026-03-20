import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { Blockstore, CID } from './blockstore.js'

export interface DocumentHead {
  id: string
  name: string
  cid: string
  createdAt: string
  updatedAt: string
}

export interface ResolvedDocument extends DocumentHead {
  content: string
}

export interface DocumentStore {
  list(): Promise<DocumentHead[]>
  get(id: string): Promise<ResolvedDocument>
  create(name: string, content: string): Promise<DocumentHead>
  update(id: string, content: string, name?: string): Promise<DocumentHead>
  remove(id: string): Promise<void>
}

export function createDocumentStore(blockstore: Blockstore, headsRoot?: string): DocumentStore {
  const root = headsRoot ?? join(homedir(), '.storylab', 'heads')

  const list = async (): Promise<DocumentHead[]> => {
    await mkdir(root, { recursive: true })

    let files: string[] = []
    try {
      const { readdir } = await import('node:fs/promises')
      files = await readdir(root)
    } catch {
      // Directory might not exist yet
      return []
    }

    const heads: DocumentHead[] = []
    for (const file of files) {
      if (!file.endsWith('.json')) continue

      try {
        const path = join(root, file)
        const data = await readFile(path, 'utf-8')
        const head = JSON.parse(data) as DocumentHead
        heads.push(head)
      } catch {
        // Skip corrupted files
        continue
      }
    }

    // Sort by updatedAt descending
    return heads.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  const getHead = async (id: string): Promise<DocumentHead | null> => {
    const path = join(root, `${id}.json`)
    try {
      const data = await readFile(path, 'utf-8')
      return JSON.parse(data) as DocumentHead
    } catch {
      return null
    }
  }

  const saveHead = async (head: DocumentHead): Promise<void> => {
    await mkdir(root, { recursive: true })
    const path = join(root, `${head.id}.json`)
    await writeFile(path, JSON.stringify(head, null, 2), 'utf-8')
  }

  const get = async (id: string): Promise<ResolvedDocument> => {
    const head = await getHead(id)
    if (!head) {
      throw new Error(`Document not found`)
    }

    const blockData = await blockstore.get(head.cid as CID)
    const content = Buffer.from(blockData).toString('utf-8')

    return {
      ...head,
      content
    }
  }

  const create = async (name: string, content: string): Promise<DocumentHead> => {
    const id = randomUUID()
    const blockData = new TextEncoder().encode(content)
    const cid = await blockstore.put(blockData)
    const now = new Date().toISOString()

    const head: DocumentHead = {
      id,
      name,
      cid,
      createdAt: now,
      updatedAt: now
    }

    await saveHead(head)
    return head
  }

  const update = async (id: string, content: string, name?: string): Promise<DocumentHead> => {
    const head = await getHead(id)
    if (!head) {
      throw new Error(`Document not found`)
    }

    const blockData = new TextEncoder().encode(content)
    const cic = await blockstore.put(blockData)
    const now = new Date().toISOString()

    const updated: DocumentHead = {
      ...head,
      cid: cic,
      name: name ?? head.name,
      updatedAt: now
    }

    await saveHead(updated)
    return updated
  }

  const remove = async (id: string): Promise<void> => {
    const head = await getHead(id)
    if (!head) {
      throw new Error(`Document not found`)
    }

    const path = join(root, `${id}.json`)
    await unlink(path)
  }

  return {
    list,
    get,
    create,
    update,
    remove
  }
}
