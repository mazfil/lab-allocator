import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import { useEffect } from 'react';
import './styles/ManageData.css';
import { deleteData, queryDatabase, uploadData, updateData } from '../utils/helperFunctions';


function ManageData(props) {
    const [courseData, setCourseData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [formData, setFormFields] = useState({
        course_code: "",
        est_size: "",
        cohorts: "",
        mix_cohorts: false,
        num_tutors: "",
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

    const [acButtonEnabled, setacButton] = useState(false); //add course button
    const [scButtonEnabled, setscButton] = useState(false); //save course button

    //fetches the database, updating courseData and filteredData
    const fetchPost = async () => {
        console.log("doing fetchpost");
        const newData = await queryDatabase("course_data");
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
        //if formData.course_code is in the list of courses, grey out box accordingly
        const matchingCourse = courseData.find(course => course.course_code.toString().toLowerCase() === formData.course_code.toString().toLowerCase());
        if(matchingCourse === undefined){ //if this course is not in the database
            setacButton(true);
            setscButton(false);
        }else{ //if it already exists
            setacButton(false);
            setscButton(true);
        }
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

    const resetFormFields = () => {
        setFormFields({
            course_code: "",
            est_size: "",
            num_cohorts: "",
            mix_cohorts: false,
            num_tutors: "",
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
    }

    const handleDeleteCourse = async (id) => {
        await deleteData("course_data", id);
        await fetchPost();
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleFilter = () => {
        if (searchTerm === '') {
            setFilteredData(courseData);
        } else {
            const filtered = courseData.filter(course => course.course_code.toString().toLowerCase().includes(searchTerm.toString().toLowerCase()));
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

    const handleAddCourse = async (event) => {
        event.preventDefault();       

        if (!validateTutorialTime()) {
            return;
        }
        await uploadData("course_data", convertFormDataToSchema());
        await fetchPost();
        resetFormFields();
        setacButton(false);
        setscButton(true);
    };

    const handleSaveCourse = async (event) => {
        event.preventDefault();

        if (!validateTutorialTime()) {
            return;
        }

        const matchingCourse = courseData.find(course => course.course_code.toString().toLowerCase() === formData.course_code.toString().toLowerCase());
        if (matchingCourse === undefined){
            setErrorMessage("Error: could not find course in the database");
        } else {
            await updateData("course_data", matchingCourse.course_code, convertFormDataToSchema());
            await fetchPost();
        }
        resetFormFields();
    }

    //Converts "xx:xx AM/PM" to a number representing the time in 24-hr time
    const longToShortTime = (timeString) => {
        if(timeString === undefined){
            return 0;
        }
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }

        return hours + (minutes / 60);
    }
    
    //Converts a number representing the time in 24-hrs to "xx:xx AM/PM"
    const shortToLongTime = (time) => {
        let morning = true;
        let hours = Math.floor(time); const mins = (time - hours)*60;
        if(hours > 11){ morning = false; }
        if(hours > 12){ hours = (hours % 12); }
        let result = hours.toString() + ":";
        if(mins < 10){ result = result + "0";}
        result = result + mins.toString();
        morning ? result = result + " AM" : result = result + " PM";
        return result;
    }

    //Converts a number of hours into a long string saying "x hours y minutes"
    const shortToLongDuration = (numHours) => {
        const hours = Math.floor(numHours); const mins = (numHours - hours)*60;
        let output = hours.toString();
        hours === 1 ? output = output + " hour " : output = output + " hours ";
        if(mins === 0){ return output;}
        output = output + mins.toString() + " minutes";
        return output;
    }

    const convertFormDataToSchema = () => {
        return {
            course_code: formData.course_code,
            est_size: formData.est_size,
            lectures: [
            {
                day: (formData.lec_day.slice(0,3)).toString().toLowerCase(),
                duration: formData.lec_duration,
                time: longToShortTime(formData.lec_time)
            }],
            mix_cohorts: formData.mix_cohorts,
            num_tutors: formData.num_tutors,
            tutorial_properties: {
                after_lecture: formData.after_lecture,
                byod: formData.byod,
                projector: formData.projector,
                tut_days: (formData.lab_days.slice(0,3)).toString().toLowerCase(),
                tut_duration: formData.lab_duration,
                tut_start_time: longToShortTime(formData.timerange_from),
                tut_end_time: longToShortTime(formData.timerange_till)
            }
        }
    }

    const convertSchemaToFormData = (course) => {
        setFormFields({
            course_code: course.course_code,
            est_size: course.est_size,
            num_cohorts: course.num_cohorts,
            mix_cohorts: course.mix_cohorts,
            num_tutors: course.num_tutors,
            lecture_amount: course.lectures.length,
            lec_day: course.lectures[0].day,
            lec_time: shortToLongTime(course.lectures[0].time),
            lec_duration: course.lectures[0].duration,
            after_lecture: course.tutorial_properties.after_lecture,
            byod: course.tutorial_properties.byod,
            lab_days: course.tutorial_properties.tut_days,
            lab_duration: course.tutorial_properties.tut_duration,
            projector: course.tutorial_properties.projector,
            timerange_from: shortToLongTime(course.tutorial_properties.tut_start_time),
            timerange_till: shortToLongTime(course.tutorial_properties.tut_end_time),
        });
        console.log(shortToLongTime(course.lectures[0].time));
    }

    return (
        <div className='manage-data-page'>
            <NavBar navigate={props.navigate} tab={'manage-data'}></NavBar>
            <div className='manage-data-content'>
                <div className='edit-data'>
                    <form onSubmit={handleAddCourse}>
                        <fieldset>
                            <legend>Course Information</legend>
                            <label>Course Code: <input type="text" id="course_code" name="course_code" value={formData.course_code} onChange={handleInputChange}></input></label>
                            <label>Course Size: <input type="number" id="est_size" name="est_size" value={formData.est_size} onChange={handleInputChange}></input></label>
                            <label>Cohorts: <input type="number" id="num_cohorts" name="num_cohorts" value={formData.num_cohorts} onChange={handleInputChange}></input></label>
                            <label>Combine Cohorts: <input type="checkbox" id="mix_cohorts" name="mix_cohorts" checked={formData.mix_cohorts} onChange={handleInputChange}></input></label>
                            <label>Number of Tutors: <input type="number" id="num_tutors" name="num_tutors" value={formData.num_tutors} onChange={handleInputChange}></input></label>
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
                <div className='course-data-buttons'>
                <button 
                    type="submit" 
                    className='add-course-data' 
                    onClick={handleAddCourse}
                    disabled={!acButtonEnabled}
                >Add Course</button>
                <button 
                    type="submit"
                    className='save-course-data' 
                    onClick={handleSaveCourse}
                    disabled={!scButtonEnabled}
                >Save Course</button>
                <button className='clear-course-data' onClick={resetFormFields}>Clear</button>
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
                                        <td>{course.est_size || ""}</td>
                                        <td>{Array.isArray(course.tutorial_properties.tut_days) ? course.tutorial_properties.tut_days.join(', ') : ""}</td>
                                        <td>{shortToLongDuration(course.tutorial_properties.tut_duration).toString() || ""}</td>
                                        <td>{course.tutorial_properties.tut_start_time && course.tutorial_properties.tut_end_time ? (shortToLongTime(course.tutorial_properties.tut_start_time)).toString() + " - " + shortToLongTime(course.tutorial_properties.tut_end_time).toString() : ""}</td>
                                        <td className='action-column'>
                                            <button className='more-button' onClick={() => toggleMoreDetails(course.id)}>
                                                <i className="bi bi-three-dots"></i> More
                                            </button>
                                            {showDetails[course.id] && (
                                                <div className='more-details'>
                                                    <p>Cohorts: {course.num_cohorts || "N/A"}</p>
                                                    <p>Combining Cohorts: {course.mix_cohorts ? "Yes" : "No"}</p>
                                                    <p>Number of Tutors: {course.num_tutors || ""}</p>
                                                    <p>Lecture Amount: {course.lectures.day ? 1 : ""}</p>
                                                    <p>Lecture Day: {Array.isArray(course.lectures) ? course.lectures.map(lect => lect.day).join(', ') : ""}</p>
                                                    <p>Lecture Time: {Array.isArray(course.lectures) ? course.lectures.map(lect => lect.time) : ""}</p>
                                                    <p>Lecture Duration: {Array.isArray(course.lectures) ? course.lectures.map(lect => shortToLongDuration(lect.duration).toString()) : ""}</p>
                                                    <p>After Lecture: {course.tutorial_properties.after_lecture ? "Yes" : "No"}</p>
                                                    <p>BYOD: {course.tutorial_properties.byod ? "Yes" : "No"}</p>
                                                    <p>Projector: {course.tutorial_properties.projector ? "Yes" : "No"}</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className='action-column'>
                                            <button className='delete-button' onClick={() => handleDeleteCourse(course.id)}>
                                                <i className="bi bi-trash"></i> Delete
                                            </button>
                                            <button className='edit-button' onClick={() => convertSchemaToFormData(course)}>
                                                <i className="bi bi-pencil"></i> Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageData;
