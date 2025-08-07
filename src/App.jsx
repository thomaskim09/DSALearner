import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import HomePage from './pages/HomePage';
import TreePage from './pages/TreePage'; 
import LinkedListPage from './pages/LinkedListPage';
import HashTablePage from './pages/HashTablePage'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tree" element={<TreePage />} />
            <Route path="/linked-list" element={<LinkedListPage />} />
            <Route path="/hash-table" element={<HashTablePage />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;