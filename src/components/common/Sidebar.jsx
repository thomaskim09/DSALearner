import React from 'react';

const Sidebar = () => {
  // Only show the current chapter as requested
  const chapters = [
    { id: 9, title: 'Trees', active: true },
  ];

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">DSA Learner</h1>
      <nav>
        <ul>
          {chapters.map(chapter => (
            <li key={chapter.id} className={chapter.active ? 'active' : ''}>
              <a href="#">{`Chapter ${chapter.id}: ${chapter.title}`}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
