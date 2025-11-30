import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { StackProvider, StackTheme, StackHandler } from '@stackframe/react'
import { stack } from './stack'
import './index.css'
import App from './App.jsx'

// Handler component for Stack Auth routes
function HandlerRoutes() {
  const location = useLocation();
  return (
    <StackHandler app={stack} location={location.pathname} fullPage />
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StackProvider app={stack}>
      <StackTheme>
        <BrowserRouter>
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>Loading...</div>}>
            <Routes>
              <Route path="/handler/*" element={<HandlerRoutes />} />
              <Route path="/*" element={<App />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </StackTheme>
    </StackProvider>
  </StrictMode>,
)
