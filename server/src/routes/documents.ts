import { FastifyPluginAsync } from 'fastify'
import { DocumentHead, ResolvedDocument } from '../document-store'

const documentsRoute: FastifyPluginAsync = async (fastify) => {
  // GET /documents - List all documents
  fastify.get<{ Reply: DocumentHead[] }>('/documents', async (request, reply) => {
    request.log.debug('fetching all documents')
    const documents = await fastify.documentStore.list()
    request.log.info({ count: documents.length }, 'documents listed')
    return documents
  })

  // GET /documents/:id - Get a specific document
  fastify.get<{ Params: { id: string }; Reply: ResolvedDocument }>(
    '/documents/:id',
    async (request, reply) => {
      const { id } = request.params
      request.log.debug({ id }, 'fetching document')

      try {
        const document = await fastify.documentStore.get(id)
        request.log.info({ id }, 'document retrieved')
        return document
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        if (message.includes('not found')) {
          request.log.warn({ id }, 'document not found')
          return reply.notFound('Document not found')
        }
        throw error
      }
    }
  )

  // POST /documents - Create a new document
  fastify.post<{ Body: { name: string; content: string }; Reply: DocumentHead }>(
    '/documents',
    async (request, reply) => {
      const { name, content } = request.body
      request.log.debug({ name }, 'creating document')

      const document = await fastify.documentStore.create(name, content)
      request.log.info({ id: document.id, name }, 'document created')
      reply.code(201)
      return document
    }
  )

  // PUT /documents/:id - Update a document
  fastify.put<{ Params: { id: string }; Body: { content: string; name?: string }; Reply: DocumentHead }>(
    '/documents/:id',
    async (request, reply) => {
      const { id } = request.params
      const { content, name } = request.body
      request.log.debug({ id }, 'updating document')

      try {
        const document = await fastify.documentStore.update(id, content, name)
        request.log.info({ id }, 'document updated')
        return document
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        if (message.includes('not found')) {
          request.log.warn({ id }, 'document not found')
          return reply.notFound('Document not found')
        }
        throw error
      }
    }
  )

  // DELETE /documents/:id - Delete a document
  fastify.delete<{ Params: { id: string } }>(
    '/documents/:id',
    async (request, reply) => {
      const { id } = request.params
      request.log.debug({ id }, 'deleting document')

      try {
        await fastify.documentStore.remove(id)
        request.log.info({ id }, 'document deleted')
        reply.code(204)
        return null
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        if (message.includes('not found')) {
          request.log.warn({ id }, 'document not found')
          return reply.notFound('Document not found')
        }
        throw error
      }
    }
  )
}

export default documentsRoute
