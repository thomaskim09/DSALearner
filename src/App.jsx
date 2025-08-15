import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import HomePage from './pages/HomePage';
import TreePage from './pages/TreePage';
import LinkedListPage from './pages/LinkedListPage';
import HashTablePage from './pages/HashTablePage';
import SimpleSortPage from './pages/SimpleSortPage';
import HeapPage from './pages/HeapPage';
import AsymptoticNotationPage from './pages/AsymptoticNotationPage';
import MergeSortPage from './pages/MergeSortPage';
import AdvancedSortPage from './pages/AdvancedSortPage';
import MultiplicationPage from './pages/MultiplicationPage';
import StackQueuePage from './pages/StackQueuePage';
import GraphsPage from './pages/GraphsPage'; 
import './App.css';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Router>
      <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/multiplication" element={<MultiplicationPage />} />
            <Route path="/asymptotic-notation" element={<AsymptoticNotationPage />} />
            <Route path="/simple-sort" element={<SimpleSortPage />} />
            <Route path="/stack-queue" element={<StackQueuePage />} />
            <Route path="/linked-list" element={<LinkedListPage />} />
            <Route path="/merge-sort" element={<MergeSortPage />} />
            <Route path="/advanced-sort" element={<AdvancedSortPage />} />
            <Route path="/tree" element={<TreePage />} />
            <Route path="/hash-table" element={<HashTablePage />} />
            <Route path="/heap" element={<HeapPage />} />
            <Route path="/graphs" element={<GraphsPage />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;