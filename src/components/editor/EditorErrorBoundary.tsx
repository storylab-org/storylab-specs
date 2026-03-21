import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary to catch and suppress Lexical editor context errors
 * that can occur during chapter switching
 */
export default class EditorErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Suppress Lexical context errors during chapter switches
    if (error.message.includes('Unable to find an active editor')) {
      console.debug('EditorErrorBoundary: suppressed Lexical context error during chapter switch')
      return
    }
    console.error('EditorErrorBoundary caught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Render blank fallback for all errors; Lexical resets via key={chapterId}
      return <div style={{ flex: 1, background: '#f9f9f9' }} />
    }

    return this.props.children
  }
}
