import React from 'react';
import NavBar from '../components/nav/NavBar';
import './styles/Wiki.css';

function Wiki(props) {
    return (
        <div className='wiki'>
            <NavBar navigate={props.navigate} tab={'wiki'} />

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
                        <p>The <strong>Dashboard</strong> is the first page that you see when you access SoCo Lab Allocator.</p>
                        <p>You can upload your data, manage the data that you upload, and manage the timetable that is generated.</p>
                        <p>There is also this Wiki, and About to give you some help, if you ever have any extra issues that are not conveyed by the Wiki, please feel free to leave a GitHub Issue on the Repository linked in the About Page.</p>
                        {/* Rest of the content */}
                    </section>

                    <section id="upload-data">
                        <h2>Upload Data Page</h2>
                        <img src="/assets/images/upload_data_normal.png" alt="Upload Data" className="wiki-image" />
                        <p>The <strong>upload data page</strong> allows the user to upload data formatted in a <strong>CSV format</strong>.</p>

                        <p>There is an <strong>example template</strong> that you can download to view the preferred format for the algorithm. However, the system should work dynamically with the structures discussed during development.</p>

                        <p>When the CSV file is uploaded, the algorithm will generate a timetable according to the criteria we have laid out. You will be able to view the timetable on the <strong>manage timetable page</strong>, and you will also have the option to <strong>export</strong> it from there.</p>
                        {/* Rest of the content */}
                    </section>

                    <section id="manage-data">
                        <h2>Manage Data Page</h2>
                        <img src="/assets/images/manage_data_normal.png" alt="Manage Data" className="wiki-image" />
                        <p>In the <strong>Manage Data Page</strong>, users can view and modify the data they previously entered via the upload data page.</p>
                        <h3>Editing the Data</h3>
                        <p>Looking at the <strong>Course Information</strong> section, you can add:</p>
                        <ul>
                            <li><strong>Course Code</strong>: This is the course code, usually formatted in either "COMP####" or just as "####"</li>
                            <li><strong>Course Size</strong>: This is where you can input or edit the size (amount) of students in the course.</li>
                            <li><strong>Cohorts</strong>: This is to designate how many cohorts there are for the course code. For example, COMP1100 and COMP1130 are two cohorts but share labs.</li>
                            <li><strong>Combine Cohorts</strong>: This is for you to add the tag saying that the course is a combined cohort, this is not relevant to our algorithm, but is included for your benefit of understanding that the course is multiple cohorts.</li>
                            <li><strong>Number of Tutors</strong>: This is to add the estimated amount of tutors that you would be running for the course.</li>
                        </ul>
                        <p>Looking at the <strong>Lecture Information</strong> section, you can add:</p>
                        <ul>
                            <li><strong>Number of Lectures</strong>: This is for you to add how many lectures that course might have</li>
                            <li><strong>Day</strong>: This allows you to select the day that the lecture/s are on.</li>
                            <li><strong>Time</strong>: This allows you to select the time that the lecture/s are at.</li>
                            <li><strong>Duration</strong>: This allows you to select the duration of the lecture/s.</li>
                        </ul>
                        <p>Looking at the <strong>Lab Preferences</strong> section, you can add:</p>
                        <ul>
                            <li><strong>After Lecture</strong>: This variable allows you to schedule the labs only after the selected lecture time/s that you have done before. If you do not select "After Lecture", the lab can be scheduled anytime from 8am Monday to 8pm Friday.</li>
                            <li><strong>BYOD</strong>: This means that the course is BYOD (Bring Your Own Device), this tags the course as BYOD and doesn't necessarily need lab computers.</li>
                            <li><strong>Days</strong>: This allows you to select what days the lab is preferred to be allocated on. So if you select Tuesday, Wednesday, Thursday. It will only be allocated on those days.</li>
                            <li><strong>Duration</strong>: This allows you to set the duration of the labs, it will be allocated in this size time.</li>
                            <li><strong>Projector</strong>: This allows you to set the tag, saying that the lab requires a room with a projector.</li>
                            <li><strong>Time Range</strong>: This allows you to select the starting time (from) and the ending time (till). This means that if the labs should only be scheduled between 9:00am and 5:00pm, this allows you to do so. And this will apply for all the days you selected above.</li>
                        </ul>
                        <img src="/assets/images/manage_data_actions.png" alt="Manage Data Actions" className="wiki-image" />
                        <p>Here you can see all the data that you have in the database at the current time, your options are:</p>
                        <ul>
                            <li><strong>More</strong>: If you press this, you will see more of the course details</li>
                            <li><strong>Edit</strong>: If you press this, it will carry all the information for that course to the top of the page, where you can edit some of the details.</li>
                            <li><strong>Delete</strong>: If you press this, it will delete the course and its entries from the database. There is no recovering this.</li>
                        </ul>
                        {/* Rest of the content */}
                    </section>

                    <section id="manage-timetable">
                        <h2>Manage Timetable Page</h2>
                        <img src="/assets/images/manage_timetable_normal.png" alt="Manage Timetable" className="wiki-image" />
                        <p>The <strong>manage timetable page</strong> allows you to view the generated timetable and make adjustments as needed.</p>

                        <p>By default, it will show the entire timetable that has been generated.</p>

                        <img src="/assets/images/manage_timetable_filter_room.png" alt="Filter by Room" className="wiki-image" />

                        <p>You can filter the timetable by clicking the <strong>room buttons</strong> above the timetable to disable rooms from view. This can help with readability by disabling the rooms that you don't want to view.</p>

                        <p>It is important to note that the <strong>colours</strong> used in the timetable correspond to the <strong>rooms</strong> that the courses are allocated to.</p>
                        
                        <img src="/assets/images/manage_timetable_filter_course.png" alt="Filter by Course" className="wiki-image" />

                        <p>You can also filter by the <strong>course code</strong> that you want to view using the <strong>dropdown</strong> at the top of the page. This dropdown dynamically updates as courses are added or removed from the timetable, allowing you to easily view the specific course you want.</p>

                        <p>To make changes to the timetable, you can move courses around by <strong>holding</strong> the left-click button and dragging the course timeslot to a new location. The system will prevent <strong>double-booking</strong> of a room at the same time.</p>

                        {/* Rest of the content */}
                    </section>

                    <section id="how-it-works">
                            <h2>How Our Program Works</h2>
                            <p>Our Algorithm contains several functions designed to generate and optimize lab allocation timetables. The core focus of these functions is to ensure that the schedule meets various constraints while aiming for efficiency and flexibility in room and time allocation.</p>

                            <section>
                                <h2>Key Functions for Optimal Allocation</h2>

                                <h3>1. <code>getFitness()</code></h3>
                                <p>This function calculates the overall fitness score of a schedule by evaluating various factors such as free space, time allocation, date variance, room variance, and more. A higher fitness score indicates a better schedule.</p>

                                <h3>2. <code>aimForPercentWithin(int start, int end, double desiredPercent)</code></h3>
                                <p>This function allocates a specific percentage of classes within a defined time window, contributing to the schedule's fitness score by aligning classes with desired times.</p>

                                <h3>3. <code>aimForPercentBeforeTime(double desiredPercent, int before)</code></h3>
                                <p>This function aims to allocate a specific percentage of classes before a certain time, helping to meet scheduling preferences.</p>

                                <h3>4. <code>aimForPercentAfterTime(double desiredPercent, int after)</code></h3>
                                <p>Similar to the previous function, this one allocates a specific percentage of classes after a particular time, contributing to the fitness score based on time preferences.</p>

                                <h3>5. <code>getDateVariance()</code></h3>
                                <p>This function calculates how well classes are distributed across the days of the week. Lower variance means a more balanced timetable.</p>

                                <h3>6. <code>getRoomVariance()</code></h3>
                                <p>This function evaluates the distribution of classes across rooms to ensure efficient usage and reduce room clustering.</p>

                                <h3>7. <code>getPercentageFree()</code></h3>
                                <p>Calculates the percentage of free time available across all rooms, contributing to the fitness score by maximizing room usage while leaving flexibility.</p>

                                <h3>8. <code>getPercentDupes()</code></h3>
                                <p>This function measures the percentage of duplicate time blocks (same class at the same time), with fewer duplicates improving flexibility for students.</p>

                                <h3>9. <code>alwaysRoomFree()</code></h3>
                                <p>Ensures there is always at least one room free at any given time, promoting schedule flexibility.</p>

                                <h3>10. <code>repeatLabsSameRoom()</code></h3>
                                <p>Ensures that repeat labs occur in the same room, optimizing the schedule for consistency and reducing room changes for students.</p>

                                <h3>11. <code>placeLabRandomly()</code> and <code>placeCourseRandomly()</code></h3>
                                <p>These functions handle the random placement of labs and courses into the schedule while respecting constraints like room availability and course length.</p>

                                <h3>12. <code>mutate()</code> and <code>moveLabRandomly()</code></h3>
                                <p>Introduce small, random changes to the schedule in order to explore new configurations that might yield better solutions.</p>

                                <h3>13. <code>crossover(Schedule a, Schedule b)</code></h3>
                                <p>This function combines two parent schedules to create a new schedule, simulating a genetic algorithm to evolve the best possible solution.</p>
                            </section>
                            {/* Rest of the content */}
                        </section>

                    <section id="faqs" className="faqs-section">
                        <h2>Frequently Asked Questions (FAQs)</h2>

                        <div className="faq-item">
                            <div className="faq-question">Are changes made by dragging saved automatically?</div>
                            <p>No, if you move rooms around or change rooms, nothing is saved until you press the save button. So make sure you don't change off the page, otherwise you will lose your work.</p>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">Can I overwrite a course assignment in the same room?</div>
                            <p>Yes, you can assign multiple labs or courses to the same room. However, you will receive a warning before proceeding to prevent unintentional conflicts.</p>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">Can I move a course or lab to a smaller room?</div>
                            <p>Yes, you can move a course or lab to a smaller room. However, you will be given a warning if the selected room may not be able to accommodate all students effectively.</p>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">Can I modify the algorithm, such as the fitness function?</div>
                            <p>No, you cannot directly edit the algorithm or its components through the interface. However, supporting documentation is available on GitHub (<a href="https://github.com/mazfil/lab-allocator" target="_blank" rel="noopener noreferrer">GitHub link</a>), which allows for manual modifications. These changes should only be attempted by someone with technical knowledge of coding and programming.</p>
                        </div>
                    </section>

                    <footer>
                        <p>&copy; 2024 SoCo Lab Allocator. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default Wiki;
