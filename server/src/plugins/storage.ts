import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { createBlockstore, Blockstore } from '../blockstore.js'
import { createDocumentStore, DocumentStore } from '../document-store.js'
import { mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

const storagePlugin: FastifyPluginAsync = async (fastify) => {
  const dataDir = process.env.STORYLAB_DATA_DIR ?? join(homedir(), '.storylab')
  const blocksRoot = join(dataDir, 'blocks')
  const headsRoot = join(dataDir, 'heads')

  // Ensure directories exist
  await mkdir(blocksRoot, { recursive: true })
  await mkdir(headsRoot, { recursive: true })

  const blockstore = createBlockstore(blocksRoot)
  const documentStore = createDocumentStore(blockstore, headsRoot)

  fastify.decorate('blockstore', blockstore)
  fastify.decorate('documentStore', documentStore)

  fastify.log.info({ blocksRoot, headsRoot }, 'storage plugin initialised')
}

export default fp(storagePlugin)

declare module 'fastify' {
  interface FastifyInstance {
    blockstore: Blockstore
    documentStore: DocumentStore
  }
}
