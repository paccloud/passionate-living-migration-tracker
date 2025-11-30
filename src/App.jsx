import React from 'react';
import MigrationTracker from './MigrationTracker';
import AuthDebug from './AuthDebug';
import './App.css';

import { Analytics } from "@vercel/analytics/react"

function App() {
  // Toggle this to switch between debug mode and normal app
  const showDebug = new URLSearchParams(window.location.search).get('debug') !== null;

  return (
    <div className="App">
      {showDebug ? <AuthDebug /> : <MigrationTracker />}
      <Analytics />
    </div>
  );
}

export default App;
