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
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
                <NavLink to="/tree" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 5: Trees</NavLink>
                <NavLink to="/linked-list" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Chapter 6: Linked Lists</NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;