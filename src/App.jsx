import React from 'react';
import MigrationTracker from './MigrationTracker';
import AuthDebug from './AuthDebug';
import './App.css';

import { Analytics } from "@vercel/analytics/react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ color: '#c00' }}>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 20, borderRadius: 8 }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 20px', cursor: 'pointer' }}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <MigrationTracker />
      </ErrorBoundary>
      <Analytics />
    </div>
  );
}

export default App;
