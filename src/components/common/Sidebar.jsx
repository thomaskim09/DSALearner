import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/styles/Sidebar.css';

const Sidebar = ({ isCollapsed, onToggle }) => {
    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <h2>{isCollapsed ? 'DS' : 'DSALearner'}</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
                <NavLink to="/multiplication" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 1: Multiplication</NavLink>
                <NavLink to="/asymptotic-notation" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 2 - 3: Asymptotic</NavLink>
                <NavLink to="/simple-sort" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 4: Simple Sorting</NavLink>
                <NavLink to="/stack-queue" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 5: Stacks & Queues</NavLink>
                <NavLink to="/linked-list" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 6: Linked Lists</NavLink>
                <NavLink to="/merge-sort" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 7: Merge Sort</NavLink>
                <NavLink to="/advanced-sort" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 8: Advanced Sort</NavLink>
                <NavLink to="/tree" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 9: Trees</NavLink>
                <NavLink to="/hash-table" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 10: Hash Tables</NavLink>
                <NavLink to="/heap" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 11: Heaps</NavLink>
                <NavLink to="/graphs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 12: Graphs</NavLink>
                <NavLink to="/dynamic-programming" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 13: Dynamic Programming</NavLink>
            </nav>
            <button onClick={onToggle} className="sidebar-toggle">
                {isCollapsed ? '»' : '«'}
            </button>
        </aside>
    );
};

export default Sidebar;