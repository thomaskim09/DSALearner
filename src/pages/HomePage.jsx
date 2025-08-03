import React from 'react';
import '../assets/styles/HomePage.css'; // We'll create this CSS file next

const HomePage = () => {
    return (
        <div className="home-page-container">
            <header className="home-header">
                <h1>Welcome to DSALearner</h1>
                <p>Your interactive guide to Data Structures and Algorithms.</p>
            </header>
            <section className="home-content">
                <h2>Getting Started</h2>
                <p>
                    This application is designed to help you visualize and understand key data structures. 
                    Each chapter in the sidebar provides an interactive playground where you can see the algorithms in action, step-by-step.
                </p>
                <div className="features-list">
                    <div className="feature-item">
                        <h3>Interactive Visualizers</h3>
                        <p>Watch trees and linked lists change as you insert, delete, and search for nodes.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Side-by-Side Code</h3>
                        <p>Understand the logic behind each operation with relevant code snippets from your course materials.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Dynamic Controls</h3>
                        <p>Experiment with different operations and data types to solidify your understanding.</p>
                    </div>
                </div>
                <p className="call-to-action">
                    Select a chapter from the sidebar on the left to begin your learning journey!
                </p>
            </section>
        </div>
    );
};

export default HomePage;