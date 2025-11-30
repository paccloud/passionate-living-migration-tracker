import React from 'react';
import { useStackApp, useUser } from '@stackframe/react';

export default function AuthDebug() {
  const app = useStackApp();
  const user = useUser();

  const debugInfo = {
    // Environment Variables
    env: {
      projectId: import.meta.env.VITE_STACK_PROJECT_ID,
      clientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
      allViteVars: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
    },
    // App Object
    app: {
      exists: !!app,
      type: typeof app,
      keys: app ? Object.keys(app) : [],
      urls: app?.urls,
      urlsKeys: app?.urls ? Object.keys(app.urls) : [],
      signInUrl: app?.urls?.signIn,
      signUpUrl: app?.urls?.signUp,
    },
    // User Object
    user: {
      exists: !!user,
      type: typeof user,
      isLoggedIn: !!user?.id,
      userId: user?.id,
      email: user?.primaryEmail,
    },
    // Stack Instance Direct Access
    stack: {
      configured: window._stackApp !== undefined,
    }
  };

  return (
    <div style={{
      padding: 40,
      maxWidth: 1000,
      margin: '0 auto',
      fontFamily: 'monospace',
      background: '#f8f9fa'
    }}>
      <h1 style={{ marginBottom: 30, color: '#8B1A1A' }}>
        Stack Auth Debug Information
      </h1>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 10, color: '#333' }}>Quick Status</h2>
        <div style={{
          padding: 20,
          background: 'white',
          borderRadius: 8,
          border: `2px solid ${app?.urls?.signIn ? '#28a745' : '#dc3545'}`
        }}>
          <p style={{ fontSize: 18, fontWeight: 'bold', color: app?.urls?.signIn ? '#28a745' : '#dc3545' }}>
            {app?.urls?.signIn ? '✅ Stack Auth is configured' : '❌ Stack Auth URLs are missing'}
          </p>
          {!app?.urls?.signIn && (
            <p style={{ color: '#dc3545', marginTop: 10 }}>
              This is the root cause of your authentication issue!
            </p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 10, color: '#333' }}>Environment Variables</h2>
        <pre style={{
          padding: 20,
          background: 'white',
          borderRadius: 8,
          overflow: 'auto',
          fontSize: 12
        }}>
          {JSON.stringify(debugInfo.env, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 10, color: '#333' }}>Stack App Object</h2>
        <pre style={{
          padding: 20,
          background: 'white',
          borderRadius: 8,
          overflow: 'auto',
          fontSize: 12
        }}>
          {JSON.stringify(debugInfo.app, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 10, color: '#333' }}>User Object</h2>
        <pre style={{
          padding: 20,
          background: 'white',
          borderRadius: 8,
          overflow: 'auto',
          fontSize: 12
        }}>
          {JSON.stringify(debugInfo.user, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 10, color: '#333' }}>Full App Object (All Properties)</h2>
        <pre style={{
          padding: 20,
          background: 'white',
          borderRadius: 8,
          overflow: 'auto',
          fontSize: 12,
          maxHeight: 400
        }}>
          {app ? JSON.stringify(app, (key, value) => {
            // Handle circular references and functions
            if (typeof value === 'function') return '[Function]';
            if (value instanceof Element) return '[DOM Element]';
            return value;
          }, 2) : 'App not available'}
        </pre>
      </div>

      <div style={{ marginTop: 30 }}>
        <h2 style={{ marginBottom: 10, color: '#333' }}>Troubleshooting Steps</h2>
        <ol style={{
          padding: 20,
          background: 'white',
          borderRadius: 8,
          lineHeight: 1.8
        }}>
          <li>Check that environment variables are loaded (see above)</li>
          <li>Verify Stack Auth dashboard configuration at <a href="https://app.stack-auth.com" target="_blank">app.stack-auth.com</a></li>
          <li>Ensure your project has authentication methods enabled (e.g., email/password, magic link)</li>
          <li>Check that the project is in "Production" or "Development" mode correctly</li>
          <li>Verify the app domain is configured in Stack Auth settings</li>
          <li>Try clearing browser cache and localStorage</li>
        </ol>
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => {
            console.log('Clearing localStorage...');
            localStorage.clear();
            window.location.reload();
          }}
          style={{
            padding: '12px 24px',
            background: '#FF8C42',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 'bold',
            marginRight: 10
          }}
        >
          Clear Storage & Reload
        </button>

        {app?.urls?.signIn && (
          <button
            onClick={() => {
              console.log('Redirecting to:', app.urls.signIn);
              window.location.href = app.urls.signIn;
            }}
            style={{
              padding: '12px 24px',
              background: '#8B1A1A',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Test Sign In Redirect
          </button>
        )}
      </div>
    </div>
  );
}
