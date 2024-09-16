import React, { Component } from 'react';
import './styles.css';

export default class Wiki extends Component {
    render() {
        return (
            <div className="wiki-container">
                {/* Side Navigation */}
                <nav className="side-nav">
                    <h2>Contents</h2>
                    <ul>
                        <li><a href="#dashboard">Dashboard</a></li>
                        <li><a href="#upload-data">Upload Data</a></li>
                        <li><a href="#manage-data">Manage Data</a></li>
                        <li><a href="#manage-timetable">Manage Timetable</a></li>
                        <li><a href="#how-it-works">How Our Program Works</a></li>
                        <li><a href="#faqs">FAQs</a></li>
                    </ul>
                </nav>

                {/* Main Content */}
                <div className="container">
                    <header>
                        <h1>SoCo Lab Allocator - Wiki</h1>
                    </header>

                    <section id="dashboard">
                        <h2>Dashboard</h2>
                        <img src="/assets/images/dashboard_normal.png" alt="Dashboard" className="wiki-image" />
                        <p>The <strong>Dashboard</strong> allows users to select functions for them to use...</p>
                        {/* Rest of the content */}
                    </section>

                    <section id="upload-data">
                        <h2>Form Section Page</h2>
                        <img src="/assets/images/upload_data_normal.png" alt="Upload Data" className="wiki-image" />
                        <p>The <strong>Form Section Page</strong> allows users to input essential information required for lab scheduling...</p>
                        {/* Rest of the content */}
                    </section>

                    <section id="manage-data">
                        <h2>Manage Data Page</h2>
                        <img src="/assets/images/manage_data_normal.png" alt="Manage Data" className="wiki-image" />
                        <p>In the <strong>Manage Data Page</strong>, users can view and modify the data they previously entered...</p>
                        {/* Rest of the content */}
                    </section>

                    <section id="manage-timetable">
                        <h2>Manage Timetable Page</h2>
                        <img src="/assets/images/manage_timetable_normal.png" alt="Manage Timetable" className="wiki-image" />
                        <p>The <strong>Manage Timetable Page</strong> allows you to view the generated timetable and make adjustments as needed...</p>
                        {/* Rest of the content */}
                    </section>

                    <section id="how-it-works">
                        <h2>How Our Program Works</h2>
                        <p>The SoCo Lab Allocator is a <strong>resource allocation application</strong> designed to optimize the scheduling...</p>
                        {/* Rest of the content */}
                    </section>

                    <section id="faqs" className="faqs-section">
                        <h2>Frequently Asked Questions (FAQs)</h2>
                        {/* FAQs content */}
                    </section>

                    <footer>
                        <p>&copy; 2024 SoCo Lab Allocator. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        );
    }
}