/**
 * Frontend API client for book export
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export type ExportFormat = 'markdown' | 'html' | 'epub'

/**
 * Fetch exported book in the specified format
 */
export async function exportBook(format: ExportFormat): Promise<Blob> {
  const response = await fetch(`${API_BASE}/export/${format}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error(`Export failed with status ${response.status}: ${response.statusText}`)
  }

  return response.blob()
}

/**
 * Trigger a browser download of a blob
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
