import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  type DocumentHead
} from '../../../src/api/documents'

describe('documents API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listDocuments', () => {
    it('should fetch documents from GET /documents', async () => {
      const mockDocs: DocumentHead[] = [
        {
          id: '1',
          name: 'Chapter 1',
          cid: 'abc123',
          createdAt: '2026-03-20T00:00:00Z',
          updatedAt: '2026-03-20T00:00:00Z',
          order: 0
        }
      ]

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockDocs
      } as Response)

      const result = await listDocuments()

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/documents')
      expect(result).toEqual(mockDocs)
    })

    it('should throw on non-2xx status', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response)

      await expect(listDocuments()).rejects.toThrow()
    })
  })

  describe('getDocument', () => {
    it('should fetch document from GET /documents/:id', async () => {
      const mockDoc = {
        id: '1',
        name: 'Chapter 1',
        cid: 'abc123',
        content: 'Hello, world!',
        createdAt: '2026-03-20T00:00:00Z',
        updatedAt: '2026-03-20T00:00:00Z',
        order: 0
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockDoc
      } as Response)

      const result = await getDocument('1')

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/documents/1')
      expect(result).toEqual(mockDoc)
    })

    it('should throw 404 error when document not found', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response)

      await expect(getDocument('nonexistent')).rejects.toThrow('Not found')
    })
  })

  describe('createDocument', () => {
    it('should POST to /documents with name and content', async () => {
      const mockDoc: DocumentHead = {
        id: 'new-id',
        name: 'New Chapter',
        cid: 'def456',
        createdAt: '2026-03-20T00:00:00Z',
        updatedAt: '2026-03-20T00:00:00Z',
        order: 0
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockDoc
      } as Response)

      const result = await createDocument('New Chapter', 'Content')

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Chapter', content: 'Content' })
      })
      expect(result).toEqual(mockDoc)
    })

    it('should throw on non-2xx status', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response)

      await expect(createDocument('Test', 'Content')).rejects.toThrow()
    })
  })

  describe('updateDocument', () => {
    it('should PUT to /documents/:id with content and optional name', async () => {
      const mockDoc: DocumentHead = {
        id: '1',
        name: 'Updated Chapter',
        cid: 'ghi789',
        createdAt: '2026-03-20T00:00:00Z',
        updatedAt: '2026-03-20T01:00:00Z',
        order: 0
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockDoc
      } as Response)

      const result = await updateDocument('1', 'New content', 'Updated Chapter')

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/documents/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'New content', name: 'Updated Chapter' })
      })
      expect(result).toEqual(mockDoc)
    })

    it('should work without optional name parameter', async () => {
      const mockDoc: DocumentHead = {
        id: '1',
        name: 'Chapter 1',
        cid: 'ghi789',
        createdAt: '2026-03-20T00:00:00Z',
        updatedAt: '2026-03-20T01:00:00Z',
        order: 0
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockDoc
      } as Response)

      const result = await updateDocument('1', 'New content')

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/documents/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'New content', name: undefined })
      })
      expect(result).toEqual(mockDoc)
    })

    it('should throw 404 error when document not found', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response)

      await expect(updateDocument('nonexistent', 'content')).rejects.toThrow('Not found')
    })
  })

  describe('deleteDocument', () => {
    it('should DELETE /documents/:id', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 204
      } as Response)

      await deleteDocument('1')

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/documents/1', {
        method: 'DELETE'
      })
    })

    it('should throw 404 error when document not found', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response)

      await expect(deleteDocument('nonexistent')).rejects.toThrow('Not found')
    })

    it('should throw on non-2xx status', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response)

      await expect(deleteDocument('1')).rejects.toThrow()
    })
  })
})
