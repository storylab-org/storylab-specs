import { useEffect, useState } from 'react'

interface ErrorEvent {
  id: string
  message: string
  timestamp: number
}

/**
 * Displays errors that occur in the editor context
 * Captures uncaught errors via window.onerror and console.error
 */
export default function EditorErrorDisplay() {
  const [errors, setErrors] = useState<ErrorEvent[]>([])

  useEffect(() => {
    const handleError = (event: ErrorEvent | Event) => {
      let message = 'Unknown error'

      if (event instanceof ErrorEvent) {
        message = event.message
      } else if ('message' in event) {
        message = (event as any).message
      }

      const newError: ErrorEvent = {
        id: `${Date.now()}-${Math.random()}`,
        message,
        timestamp: Date.now()
      }

      setErrors((prev) => [newError, ...prev].slice(0, 10)) // Keep last 10
    }

    // Capture uncaught errors
    window.addEventListener('error', handleError)

    // Capture console.error calls
    const originalError = console.error
    console.error = (...args: any[]) => {
      const message = args.map((arg) =>
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ')

      const newError: ErrorEvent = {
        id: `${Date.now()}-${Math.random()}`,
        message,
        timestamp: Date.now()
      }

      setErrors((prev) => [newError, ...prev].slice(0, 10))
      originalError(...args)
    }

    return () => {
      window.removeEventListener('error', handleError)
      console.error = originalError
    }
  }, [])

  if (errors.length === 0) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '200px',
        overflowY: 'auto',
        background: '#fee',
        border: '2px solid #f00',
        borderRadius: '4px',
        padding: '12px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 10000
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#c00' }}>
        ⚠️ Errors ({errors.length}):
      </div>
      {errors.map((error) => (
        <div
          key={error.id}
          style={{
            marginBottom: '6px',
            padding: '6px',
            background: '#fff',
            border: '1px solid #f99',
            borderRadius: '2px',
            color: '#900'
          }}
        >
          <div style={{ fontSize: '10px', color: '#666' }}>
            {new Date(error.timestamp).toLocaleTimeString()}
          </div>
          <div style={{ wordBreak: 'break-word' }}>{error.message}</div>
        </div>
      ))}
    </div>
  )
}
