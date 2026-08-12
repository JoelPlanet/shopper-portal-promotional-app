/** Error boundary for the display — renders a plain fallback on uncaught errors. */
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[DisplayErrorBoundary]', error, info)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100dvh',
            background: '#000',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: '"TT Commons", "TT Commons Pro", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(1rem, 3vw, 2rem)',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          Display temporarily unavailable
        </div>
      )
    }
    return this.props.children
  }
}
