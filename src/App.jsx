import React from 'react';
import ChapterPage from './pages/ChapterPage';
import Sidebar from './components/common/Sidebar';
import './assets/styles/main.css'; // General styles
import './assets/styles/Tree.css'; // Component-specific styles

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <ChapterPage />
      </main>
    </div>
  );
}

export default App;
