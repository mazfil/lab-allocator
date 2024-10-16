import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import { useEffect } from 'react';
import './styles/ManageData.css';
import { deleteData, queryDatabase, uploadData, updateData } from '../utils/helperFunctions';


function ManageData(props) {
    //All course data
    const [courseData, setCourseData] = useState([]);
    //Subset of all course data, that which shows up on the screen (as the user can filter it)
    const [filteredData, setFilteredData] = useState([]);
    //Data in the user input fields
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

    //Whether the add course button is enabled
    const [acButtonEnabled, setacButton] = useState(false);
    //Whether the save course button is enabled
    const [scButtonEnabled, setscButton] = useState(false);

    //Fetches course data from the database, updating courseData and filteredData
    const fetchPost = async () => {
        const newData = await queryDatabase("course_data");
        setCourseData(newData);
        setFilteredData(newData);
    };

    useEffect(() => { fetchPost(); }, []);

    //Called when the user interacts with any of the text/checkbox input fields
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormFields(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
        //depending on whether the user entered a course that already exists, grey out either the select course/add course button
        const matchingCourse = courseData.find(course => course.course_code.toString().toLowerCase() === formData.course_code.toString().toLowerCase());
        if(matchingCourse === undefined){
            setacButton(true);
            setscButton(false);
        }else{
            setacButton(false);
            setscButton(true);
        }
    };

    //Called when the user changes the input of either of the 'days' dropdowns
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

    //Validate that a tutorial doesn't clash with the lectures
    const validateTutorialTime = () => {
        const lectureStart = new Date(`01/01/2022 ${formData.lec_time}`);
        const lectureEnd = new Date(lectureStart.getTime() + formData.lec_duration * 60 * 60 * 1000);

        const tutorialStart = new Date(`01/01/2022 ${formData.timerange_from}`);
        const tutorialEnd = new Date(`01/01/2022 ${formData.timerange_till}`);
        
        var dayOverlap = false;
        formData.lab_days.forEach(day => {
            if(day === formData.lec_day){
                dayOverlap = true;
            }
        });

        if ((tutorialStart < lectureEnd) && (tutorialEnd > lectureStart) && dayOverlap) {
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

    const handleEditCourse = async (course) => {
        convertSchemaToFormDataAndSet(course);
        setacButton(false);
        setscButton(true);
    }

    //converts e.g. 9.5 into "09:30"
    //this and the next function are used because some times are stored as integers in the database
    const convertIntHourToFormal = (intHour) => {
        var result = ''
        if(intHour < 10){
            result = result + "0"
        }
        result = result + intHour.toString();
        if(Math.round(intHour) - intHour === 0){
            result = result + ":00"
        }else{
            result = result + ":30"
        }
        return result;
    }

    //converts e.g. "09:30" to 9.5
    const convertFormaltoIntHour = (formalTime) => {
        var result = 0;
        formalTime = formalTime.slice(0,5);
        if(formalTime[3] === '3'){
            result = result + 0.5;
        }
        var hours = parseInt(formalTime.slice(0,2));
        result = result + hours;
        return result;
    }

    //Converts the data as stored in the user input field to the schema used by the database
    const convertFormDataToSchema = () => {
        return {
            course_code: formData.course_code,
            est_size: formData.est_size,
            lectures: [
            {
                day: formData.lec_day.toLowerCase(),
                duration: formData.lec_duration,
                time: convertFormaltoIntHour(formData.lec_time),
            }],
            mix_cohorts: formData.mix_cohorts,
            num_tutors: formData.num_tutors,
            tutorial_properties: {
                after_lecture: formData.after_lecture,
                byod: formData.byod,
                projector: formData.projector,
                tut_days: formData.lab_days,
                tut_duration: formData.lab_duration*60, //database stores this as minutes
                tut_start_time: formData.timerange_from,
                tut_end_time: formData.timerange_till
            }
        }
    }

    //Converts the data as stored in the database into the correct format for the user input fields (and sets it)
    const convertSchemaToFormDataAndSet = (course) => {
        setFormFields({
            course_code: course.course_code,
            est_size: course.est_size,
            num_cohorts: course.num_cohorts,
            mix_cohorts: course.mix_cohorts,
            num_tutors: course.num_tutors,
            lecture_amount: course.lectures.length,
            lec_day: course.lectures[0].day, //change these 3 once options for the other lectures exist
            lec_time: convertIntHourToFormal(course.lectures[0].time),
            lec_duration: course.lectures[0].duration,
            after_lecture: course.tutorial_properties.after_lecture,
            byod: course.tutorial_properties.byod,
            lab_days: course.tutorial_properties.tut_days,
            lab_duration: course.tutorial_properties.tut_duration,
            projector: course.tutorial_properties.projector,
            timerange_from: course.tutorial_properties.tut_start_time,
            timerange_till: course.tutorial_properties.tut_end_time
        });
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
                                    <option value="mon">Monday</option>
                                    <option value="tue">Tuesday</option>
                                    <option value="wed">Wednesday</option>
                                    <option value="thu">Thursday</option>
                                    <option value="fri">Friday</option>
                                </select>
                            </label>
                            <label>Time: 
                                <select id="lec_time" name="lec_time" value={formData.lec_time} onChange={handleInputChange}>
                                    <option value="">Select a time</option>
                                    <option value="08:00">08:00</option>
                                    <option value="08:30">08:30</option>
                                    <option value="09:00">09:00</option>
                                    <option value="09:30">09:30</option>
                                    <option value="10:00">10:00</option>
                                    <option value="10:30">10:30</option>
                                    <option value="11:00">11:00</option>
                                    <option value="11:30">11:30</option>
                                    <option value="12:00">12:00</option>
                                    <option value="12:30">12:30</option>
                                    <option value="13:00">13:00</option>
                                    <option value="13:30">13:30</option>
                                    <option value="14:00">14:00</option>
                                    <option value="14:30">14:30</option>
                                    <option value="15:00">15:00</option>
                                    <option value="15:30">15:30</option>
                                    <option value="16:00">16:00</option>
                                    <option value="16:30">16:30</option>
                                    <option value="17:00">17:00</option>
                                    <option value="17:30">17:30</option>
                                    <option value="18:00">18:00</option>
                                    <option value="18:30">18:30</option>
                                    <option value="19:00">19:00</option>
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
                                    <option value="mon">Monday</option>
                                    <option value="tue">Tuesday</option>
                                    <option value="wed">Wednesday</option>
                                    <option value="thu">Thursday</option>
                                    <option value="fri">Friday</option>
                                </select>
                            </label>
                            <label>Duration: 
                                <select id="lab_duration" name="lab_duration" value={formData.lab_duration} onChange={handleInputChange}>
                                    <option value="">Select duration</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1 hour 30 minutes</option>
                                    <option value="120">2 hours</option>
                                    <option value="150">2 hours 30 minutes</option>
                                    <option value="180">3 hours</option>
                                </select>
                            </label>
                            <label>Projector: <input type="checkbox" id="projector" name="projector" checked={formData.projector} onChange={handleInputChange}></input></label>
                            <label>Time Range: 
                                <label>From: 
                                    <select id="timerange_from" name="timerange_from" value={formData.timerange_from} onChange={handleInputChange}>
                                        <option value="">Select start time</option>
                                        <option value="08:00">08:00</option>
                                        <option value="08:30">08:30</option>
                                        <option value="09:00">09:00</option>
                                        <option value="09:30">09:30</option>
                                        <option value="10:00">10:00</option>
                                        <option value="10:30">10:30</option>
                                        <option value="11:00">11:00</option>
                                        <option value="11:30">11:30</option>
                                        <option value="12:00">12:00</option>
                                        <option value="12:30">12:30</option>
                                        <option value="13:00">13:00</option>
                                        <option value="13:30">13:30</option>
                                        <option value="14:00">14:00</option>
                                        <option value="14:30">14:30</option>
                                        <option value="15:00">15:00</option>
                                        <option value="15:30">15:30</option>
                                        <option value="16:00">16:00</option>
                                        <option value="16:30">16:30</option>
                                        <option value="17:00">17:00</option>
                                        <option value="17:30">17:30</option>
                                        <option value="18:00">18:00</option>
                                        <option value="18:30">18:30</option>
                                        <option value="19:00">19:00</option>
                                        <option value="19:30">19:30</option>
                                        <option value="20:00">20:00</option>
                                    </select>
                                </label>
                                <label>Till: 
                                    <select id="timerange_till" name="timerange_till" value={formData.timerange_till} onChange={handleInputChange}>
                                        <option value="">Select end time</option>
                                        <option value="08:00">08:00</option>
                                        <option value="08:30">08:30</option>
                                        <option value="09:00">09:00</option>
                                        <option value="09:30">09:30</option>
                                        <option value="10:00">10:00</option>
                                        <option value="10:30">10:30</option>
                                        <option value="11:00">11:00</option>
                                        <option value="11:30">11:30</option>
                                        <option value="12:00">12:00</option>
                                        <option value="12:30">12:30</option>
                                        <option value="13:00">13:00</option>
                                        <option value="13:30">13:30</option>
                                        <option value="14:00">14:00</option>
                                        <option value="14:30">14:30</option>
                                        <option value="15:00">15:00</option>
                                        <option value="15:30">15:30</option>
                                        <option value="16:00">16:00</option>
                                        <option value="16:30">16:30</option>
                                        <option value="17:00">17:00</option>
                                        <option value="17:30">17:30</option>
                                        <option value="18:00">18:00</option>
                                        <option value="18:30">18:30</option>
                                        <option value="19:00">19:00</option>
                                        <option value="19:30">19:30</option>
                                        <option value="20:00">20:00</option>
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
                                <th>More</th>
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
                                        <td>{course.tutorial_properties.tut_duration + " minutes" || ""}</td>
                                        <td>{course.tutorial_properties.tut_start_time && course.tutorial_properties.tut_end_time ? course.tutorial_properties.tut_start_time.slice(0, 5) + " - " + course.tutorial_properties.tut_end_time.slice(0, 5) : ""}</td>
                                        <td className='action-column'>
                                            <button className='more-button' onClick={() => toggleMoreDetails(course.id)}>
                                                <i className="bi bi-three-dots"></i> More
                                            </button>
                                            {showDetails[course.id] && (
                                                <div className='more-details'>
                                                    <p>Cohorts: {course.num_cohorts || "N/A"}</p>
                                                    <p>Combining Cohorts: {course.mix_cohorts ? "Yes" : "No"}</p>
                                                    <p>Number of Tutors: {course.num_tutors || ""}</p>
                                                    <p>Lecture Amount: {course.lectures.length}</p>
                                                    <p>Lecture Day: {Array.isArray(course.lectures) ? course.lectures.map(lect => lect.day).join(', ') : ""}</p>
                                                    <p>Lecture Time: {Array.isArray(course.lectures) ? course.lectures.map(lect => convertIntHourToFormal(lect.time)).join(', ') : ""}</p>
                                                    <p>Lecture Duration: {Array.isArray(course.lectures) ? course.lectures.map(lect => lect.duration + " hours").join(', ') : ""}</p>
                                                    <p>After Lecture: {course.tutorial_properties.after_lecture ? "Yes" : "No"}</p>
                                                    <p>BYOD: {course.tutorial_properties.byod ? "Yes" : "No"}</p>
                                                    <p>Projector: {course.tutorial_properties.projector ? "Yes" : "No"}</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className='action-column'>
                                            <button className='delete-button' onClick={() => handleDeleteCourse(course.course_code)}>
                                                <i className="bi bi-trash"></i> Delete
                                            </button>
                                            <button className='edit-button' onClick={() => handleEditCourse(course)}>
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
