
import { Component } from 'react';

export default class Wiki extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>SoCo Lab Allocator - Wiki</h1>
                </header>

                <section>
                    <h2>Form Section Page</h2>
                    <p>The <strong>Form Section Page</strong> allows users to input essential information required for lab scheduling. You can enter data such as course name, number of students, and desired lab times. This data is then processed to generate an optimized timetable based on lab availability and other constraints.</p>
                    <p><em>Instructions for filling out the form:</em></p>
                    <ul>
                        <li>Enter course details such as name, code, and expected number of students.</li>
                        <li>Select the preferred lab times from the dropdown.</li>
                        <li>Submit the form to process the data.</li>
                    </ul>
                </section>

                <section>
                    <h2>Manage Data Page</h2>
                    <p>In the <strong>Manage Data Page</strong>, users can view and modify the data they previously entered. This page is critical for ensuring that any changes in course requirements or lab availability are reflected in the scheduling process.</p>
                    <ul>
                        <li>Edit or delete previously entered course information.</li>
                        <li>Upload new course data in bulk (CSV format).</li>
                        <li>View detailed logs of all changes made to the data.</li>
                    </ul>
                </section>

                <section>
                    <h2>Manage Timetable Page</h2>
                    <p>The <strong>Manage Timetable Page</strong> allows you to view the generated timetable and make adjustments as needed. You can move classes around, change lab rooms, and ensure that the schedule meets the required constraints.</p>
                    <ul>
                        <li>Drag-and-drop functionality for rescheduling classes.</li>
                        <li>Filters to view specific labs by course or room.</li>
                        <li>Ability to export the timetable to a printable format.</li>
                    </ul>
                </section>

                <section>
                    <h2>How Our Program Works</h2>
                    <p>The SoCo Lab Allocator is a <strong>resource allocation application</strong> designed to optimize the scheduling of computing courses across limited lab rooms at ANU. The app adapts to new course entries and creates an efficient weekly timetable, maximizing the use of resources while adhering to strict constraints.</p>
                    <p><em>Project Vision:</em></p>
                    <p>Our goal is to develop an adaptable, resource-efficient scheduling system that integrates easily into the existing university infrastructure. The end vision is an application capable of adjusting to new data and creating an optimized schedule that meets educational and resource requirements.</p>
                </section>

                <section className="faqs-section">
                    <h2>Frequently Asked Questions (FAQs)</h2>

                    <div className="faq-item">
                        <p className="faq-question">1. How do I add a new course?</p>
                        <p>You can add a new course by navigating to the Form Section Page. Fill in the required details and submit the form.</p>
                    </div>

                    <div className="faq-item">
                        <p className="faq-question">2. Can I edit the timetable after it is generated?</p>
                        <p>Yes, you can make changes to the timetable in the Manage Timetable Page using the drag-and-drop functionality to adjust course times and rooms.</p>
                    </div>

                    <div className="faq-item">
                        <p className="faq-question">3. What if two courses have overlapping schedules?</p>
                        <p>If a scheduling conflict is detected, the system will flag the clash, and you'll be prompted to resolve it by rescheduling one of the labs.</p>
                    </div>

                    <div className="faq-item">
                        <p className="faq-question">4. Can I upload multiple courses at once?</p>
                        <p>Yes, the Manage Data Page allows bulk uploads via CSV files for adding multiple courses in one go.</p>
                    </div>

                    <div className="faq-item">
                        <p className="faq-question">5. How can I view the generated timetable?</p>
                        <p>Once the timetable is generated, you can view it on the Manage Timetable Page. It is displayed in a calendar format for easy adjustments.</p>
                    </div>
                </section>

                <footer>
                    <p>&copy; 2024 SoCo Lab Allocator. All rights reserved.</p>
                </footer>
            </div>
        );
    }
}
