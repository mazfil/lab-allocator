import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect } from 'react';
import './ManageData.css';

function ManageData(props) {
    const [courseData, setCourseData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [formData, setFormFields] = useState({
        course_code: "",
        course_size: "",
        cohorts: "",
        mix_cohorts: false,
        tutors: "",
        lecture_amount: "",
        lec_day: "",
        lec_time: "",
        lec_duration: "",
        after_lecture: false,
        byod: false,
        lab_days: [],
        lab_duration: "",
        projector: false,
        timerange_from: "",
        timerange_till: "",
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDetails, setShowDetails] = useState({});

    const fetchPost = async () => {
        const querySnapshot = await getDocs(collection(db, "course_data"));
        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setCourseData(newData);
        setFilteredData(newData);
    };

    useEffect(() => { fetchPost(); }, []);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormFields(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDaysChange = (event) => {
        const { options } = event.target;
        const selectedDays = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedDays.push(options[i].value);
            }
        }
        setFormFields(prevState => ({
            ...prevState,
            lab_days: selectedDays
        }));
    };

    const validateTutorialTime = () => {
        const lectureStart = new Date(`01/01/2022 ${formData.lec_time}`);
        const lectureEnd = new Date(lectureStart.getTime() + formData.lec_duration * 60 * 60 * 1000);

        const tutorialStart = new Date(`01/01/2022 ${formData.timerange_from}`);
        const tutorialEnd = new Date(`01/01/2022 ${formData.timerange_till}`);

        if (tutorialStart < lectureEnd && tutorialEnd > lectureStart) {
            setErrorMessage("The tutorial time cannot overlap with the lecture time.");
            return false;
        }

        setErrorMessage('');
        return true;
    };

    const handleAddCourse = async (event) => {
        event.preventDefault();

        if (!validateTutorialTime()) {
            return;
        }

        await addDoc(collection(db, "course_data"), formData);
        fetchPost();
        setFormFields({
            course_code: "",
            course_size: "",
            cohorts: "",
            mix_cohorts: false,
            tutors: "",
            lecture_amount: "",
            lec_day: "",
            lec_time: "",
            lec_duration: "",
            after_lecture: false,
            byod: false,
            lab_days: [],
            lab_duration: "",
            projector: false,
            timerange_from: "",
            timerange_till: "",
        });
    };

    const handleDeleteCourse = async (id) => {
        await deleteDoc(doc(db, "course_data", id));
        fetchPost();
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleFilter = () => {
        if (searchTerm === '') {
            setFilteredData(courseData);
        } else {
            const filtered = courseData.filter(course => course.course_code.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredData(filtered);
        }
    };

    const handleReset = () => {
        setFilteredData(courseData);
        setSearchTerm('');
    };

    const toggleMoreDetails = (id) => {
        setShowDetails(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <div className='manage-data-page'>
            <NavBar navigate={props.navigate} tab={'manage-data'}></NavBar>
            <div className='manage-data-content'>
                <div className='edit-data'>
                    <form onSubmit={handleAddCourse}>
                        <fieldset>
                            <legend>Course Information</legend>
                            <label>Course Code: <input type="text" id="course_code" name="course_code" value={formData.course_code} onChange={handleInputChange}></input></label>
                            <label>Course Size: <input type="number" id="course_size" name="course_size" value={formData.course_size} onChange={handleInputChange}></input></label>
                            <label>Cohorts: <input type="number" id="cohorts" name="cohorts" value={formData.cohorts} onChange={handleInputChange}></input></label>
                            <label>Combine Cohorts: <input type="checkbox" id="mix_cohorts" name="mix_cohorts" checked={formData.mix_cohorts} onChange={handleInputChange}></input></label>
                            <label>Number of Tutors: <input type="number" id="tutors" name="tutors" value={formData.tutors} onChange={handleInputChange}></input></label>
                        </fieldset>

                        <fieldset>
                            <legend>Lecture Information</legend>
                            <label>Number of Lectures: <input type="number" id="lecture_amount" name="lecture_amount" value={formData.lecture_amount} onChange={handleInputChange}></input></label>
                            <label>Day: 
                                <select id="lec_day" name="lec_day" value={formData.lec_day} onChange={handleInputChange}>
                                    <option value="">Select a day</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                </select>
                            </label>
                            <label>Time: 
                                <select id="lec_time" name="lec_time" value={formData.lec_time} onChange={handleInputChange}>
                                    <option value="">Select a time</option>
                                    <option value="9:00 AM">9:00 AM</option>
                                    <option value="9:30 AM">9:30 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="10:30 AM">10:30 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="11:30 AM">11:30 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="12:30 PM">12:30 PM</option>
                                    <option value="1:00 PM">1:00 PM</option>
                                    <option value="1:30 PM">1:30 PM</option>
                                    <option value="2:00 PM">2:00 PM</option>
                                    <option value="2:30 PM">2:30 PM</option>
                                    <option value="3:00 PM">3:00 PM</option>
                                    <option value="3:30 PM">3:30 PM</option>
                                    <option value="4:00 PM">4:00 PM</option>
                                    <option value="4:30 PM">4:30 PM</option>
                                    <option value="5:00 PM">5:00 PM</option>
                                    <option value="5:30 PM">5:30 PM</option>
                                    <option value="6:00 PM">6:00 PM</option>
                                    <option value="6:30 PM">6:30 PM</option>
                                    <option value="7:00 PM">7:00 PM</option>
                                </select>
                            </label>
                            <label>Duration: 
                                <select id="lec_duration" name="lec_duration" value={formData.lec_duration} onChange={handleInputChange}>
                                    <option value="">Select duration</option>
                                    <option value="1">1 hour</option>
                                    <option value="1.5">1 hour 30 minutes</option>
                                    <option value="2">2 hours</option>
                                    <option value="2.5">2 hours 30 minutes</option>
                                    <option value="3">3 hours</option>
                                </select>
                            </label>
                        </fieldset>

                        <fieldset>
                            <legend>Lab Preferences</legend>
                            <label>After Lecture: <input type="checkbox" id="after_lecture" name="after_lecture" checked={formData.after_lecture} onChange={handleInputChange}></input></label>
                            <label>BYOD: <input type="checkbox" id="byod" name="byod" checked={formData.byod} onChange={handleInputChange}></input></label>
                            <label>Days: 
                                <select id="lab_days" name="lab_days" multiple={true} value={formData.lab_days} onChange={handleDaysChange}>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                </select>
                            </label>
                            <label>Duration: 
                                <select id="lab_duration" name="lab_duration" value={formData.lab_duration} onChange={handleInputChange}>
                                    <option value="">Select duration</option>
                                    <option value="1">1 hour</option>
                                    <option value="1.5">1 hour 30 minutes</option>
                                    <option value="2">2 hours</option>
                                    <option value="2.5">2 hours 30 minutes</option>
                                    <option value="3">3 hours</option>
                                </select>
                            </label>
                            <label>Projector: <input type="checkbox" id="projector" name="projector" checked={formData.projector} onChange={handleInputChange}></input></label>
                            <label>Time Range: 
                                <label>From: 
                                    <select id="timerange_from" name="timerange_from" value={formData.timerange_from} onChange={handleInputChange}>
                                        <option value="">Select start time</option>
                                        <option value="9:00 AM">9:00 AM</option>
                                        <option value="9:30 AM">9:30 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="10:30 AM">10:30 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="11:30 AM">11:30 AM</option>
                                        <option value="12:00 PM">12:00 PM</option>
                                        <option value="12:30 PM">12:30 PM</option>
                                        <option value="1:00 PM">1:00 PM</option>
                                        <option value="1:30 PM">1:30 PM</option>
                                        <option value="2:00 PM">2:00 PM</option>
                                        <option value="2:30 PM">2:30 PM</option>
                                        <option value="3:00 PM">3:00 PM</option>
                                        <option value="3:30 PM">3:30 PM</option>
                                        <option value="4:00 PM">4:00 PM</option>
                                        <option value="4:30 PM">4:30 PM</option>
                                        <option value="5:00 PM">5:00 PM</option>
                                        <option value="5:30 PM">5:30 PM</option>
                                        <option value="6:00 PM">6:00 PM</option>
                                        <option value="6:30 PM">6:30 PM</option>
                                        <option value="7:00 PM">7:00 PM</option>
                                    </select>
                                </label>
                                <label>Till: 
                                    <select id="timerange_till" name="timerange_till" value={formData.timerange_till} onChange={handleInputChange}>
                                        <option value="">Select end time</option>
                                        <option value="9:30 AM">9:30 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="10:30 AM">10:30 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="11:30 AM">11:30 AM</option>
                                        <option value="12:00 PM">12:00 PM</option>
                                        <option value="12:30 PM">12:30 PM</option>
                                        <option value="1:00 PM">1:00 PM</option>
                                        <option value="1:30 PM">1:30 PM</option>
                                        <option value="2:00 PM">2:00 PM</option>
                                        <option value="2:30 PM">2:30 PM</option>
                                        <option value="3:00 PM">3:00 PM</option>
                                        <option value="3:30 PM">3:30 PM</option>
                                        <option value="4:00 PM">4:00 PM</option>
                                        <option value="4:30 PM">4:30 PM</option>
                                        <option value="5:00 PM">5:00 PM</option>
                                        <option value="5:30 PM">5:30 PM</option>
                                        <option value="6:00 PM">6:00 PM</option>
                                        <option value="6:30 PM">6:30 PM</option>
                                        <option value="7:00 PM">7:00 PM</option>
                                    </select>
                                </label>
                            </label>
                        </fieldset>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                </div>
                
                <div className='search-bar'>
                    <label>Search by Course Code: <input type="text" value={searchTerm} onChange={handleSearchChange} /></label>
                    <button onClick={handleFilter} className='filter-button'>Filter</button>
                    <button onClick={handleReset} className='reset-button'>Reset</button>
                </div>

                <div className='data-table'>
                    <table>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Size</th>
                                <th>Lab Days</th>
                                <th>Lab Duration</th>
                                <th>Time Range</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((course) => {
                                return (
                                    <tr key={course.id}>
                                        <td>{course.course_code || ""}</td>
                                        <td>{course.course_size || ""}</td>
                                        <td>{Array.isArray(course.lab_days) ? course.lab_days.join(', ') : ""}</td>
                                        <td>{course.lab_duration || ""}</td>
                                        <td>{course.timerange_from && course.timerange_till ? `${course.timerange_from} - ${course.timerange_till}` : ""}</td>
                                        <td className='action-column'>
                                            <button className='more-button' onClick={() => toggleMoreDetails(course.id)}>
                                                <i className="bi bi-three-dots"></i> More
                                            </button>
                                            {showDetails[course.id] && (
                                                <div className='more-details'>
                                                    <p>Cohorts: {course.cohorts || ""}</p>
                                                    <p>Combining Cohorts: {course.mix_cohorts ? "Yes" : "No"}</p>
                                                    <p>Number of Tutors: {course.tutors || ""}</p>
                                                    <p>Lecture Amount: {course.lecture_amount || ""}</p>
                                                    <p>Lecture Day: {course.lec_day || ""}</p>
                                                    <p>Lecture Time: {course.lec_time || ""}</p>
                                                    <p>Lecture Duration: {course.lec_duration || ""}</p>
                                                    <p>After Lecture: {course.after_lecture ? "Yes" : "No"}</p>
                                                    <p>BYOD: {course.byod ? "Yes" : "No"}</p>
                                                    <p>Projector: {course.projector ? "Yes" : "No"}</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className='action-column'>
                                            <button className='delete-button' onClick={() => handleDeleteCourse(course.id)}>
                                                <i className="bi bi-trash"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="button-container-bottom">
                    <button type="submit" className='add-button' onClick={handleAddCourse}>Add Course</button>
                </div>
            </div>
        </div>
    );
}

export default ManageData;
