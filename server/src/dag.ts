/**
 * CID/DAG manifest structure for future book export support.
 * Scaffolding only — no behaviour implemented yet.
 */

export interface ChapterRef {
  id: string // document UUID
  name: string
  cid: string // SHA-256 hash of content block
  order: number
}

export interface Manifest {
  version: '1'
  title: string
  chapters: ChapterRef[]
  createdAt: string
}

/**
 * Store a manifest in the blockstore and return its CID.
 * TODO: Implement this function to encode the manifest as JSON,
 * store it in the blockstore, and return the SHA-256 CID.
 */
export async function storeManifest(manifest: Manifest): Promise<string> {
  throw new Error('storeManifest not yet implemented')
}
