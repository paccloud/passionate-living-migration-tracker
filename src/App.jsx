import React from 'react';
import MigrationTracker from './MigrationTracker';
import './App.css';

import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className="App">
      <MigrationTracker />
      <Analytics />
    </div>
  );
}

export default App;
