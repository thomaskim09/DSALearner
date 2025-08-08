import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/styles/Sidebar.css'; 

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>DSALearner</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
                <NavLink to="/simple-sort" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 4: Simple Sorting</NavLink>
                <NavLink to="/linked-list" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 6: Linked Lists</NavLink>
                <NavLink to="/tree" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 9: Trees</NavLink>
                <NavLink to="/hash-table" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 10: Hash Tables</NavLink>
                <NavLink to="/heap" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 11: Heaps</NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;