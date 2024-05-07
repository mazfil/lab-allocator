import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import {collection, getDocs} from 'firebase/firestore'
import { useEffect } from 'react';
import * as helpers from "../utils/helperFunctions.js";
import { useNavigate } from 'react-router';

function ManageData(props){
    const navigate = useNavigate();

    const [course_data, setCourseData] = useState([]);

    const fetchPost = async () => {
        setCourseData(await helpers.getData("course_data"))
    }

    useEffect(() => {fetchPost();}, [])

    const [formData, setFormFields] = useState({
        course_data: "",
        course_size: null,
        cohorts: null,
        mix_cohorts: false,
        tutors: null,
        after_lecture: false,
        byod: false,
        lab_days: [],
        duration: null,
        projector: null,
        timerange_from: null,
        timerange_till: null,
    });

    const updateFields = (course) =>{
        setFormFields({
            course_data: course.id,
            course_size: course.course_size,
            cohorts: course.cohorts,
            mix_cohorts: course.mix_cohorts,
            tutors: course.tutors,
            after_lecture: course.lab_preferences.after_lecture,
            byod: course.lab_preferences.byod,
            lab_days: course.lab_preferences.days,
            duration: course.lab_preferences.duration,
            projector: course.lab_preferences.projector,
            timerange_from: course.lab_preferences.time_range[0],
            timerange_till: course.lab_preferences.time_range[1],
        })
    }

    const [sx, us] = useState(false);
    const updateState = () => {us(!sx)}

    return(
        <div className='manage-data-page'>
            <NavBar navigate={props.navigate} tab={'manage-data'}></NavBar>
            <div className='manage-data-content'>
                <div className='edit-data'>
                    <form>
                        <fieldset>
                        <legend>Course Information</legend>
                            <label>Course Code: <input type="text" id="course_code" name="course_code" defaultValue={formData.course_data}></input></label>
                            <label>Course Size: <input type="number" id="course_size" name="course_size" defaultValue={formData.course_size}></input></label>
                            <label>Cohorts: <input type="number" id="cohorts" name="cohorts" defaultValue={formData.cohorts}></input></label>
                            <label>Combine Cohorts: <input type="checkbox" id="mix_cohorts" name="mix_cohorts" checked={formData.mix_cohorts}></input></label>
                            <label>Number of Tutors: <input type="text" id="tutors" name="tutors" defaultValue={formData.tutors}></input></label>
                        </fieldset>

                        <fieldset>
                        <legend>Lecture Information</legend>
                            <label>Number of Lectures: <input type="number" id="lecture_amount" name="lecture_amount" defaultValue={formData.course_data}></input></label>

                            <label>Day: <input type="text" id="lec_day" name="lec_day"></input></label>
                            <label>Time: <input type="number" id="lec_time" name="lec_time"></input></label>
                            <label>Duration: <input type="number" id="lec_duration" name="lec_duration"></input></label>
                            
                        </fieldset>

                        <fieldset>
                        <legend>Lab Preferences</legend>
                            <label>After Lecture: <input type="checkbox" id="after_lecture" name="after_lecture" defaultChecked={formData.after_lecture}></input></label>
                            <label>BYOD: <input type="checkbox" id="byod" name="byod" checked={formData.byod}></input></label>
                            <p>Days: <br></br>
                            <label>Monday <input type="checkbox" id="lab_days" name="days[]" value="Mon" checked={formData.lab_days.includes("Mon")}></input></label><br></br>
                            <label>Tuesday <input type="checkbox" id="lab_days" name="days[]" value="Tue" checked={formData.lab_days.includes("Tue")}></input></label><br></br>
                            <label>Wednesday <input type="checkbox" id="lab_days" name="days[]" value="Wed" checked={formData.lab_days.includes("Wed")}></input></label><br></br>
                            <label>Thursday <input type="checkbox" id="lab_days" name="days[]" value="Thur" checked={formData.lab_days.includes("Thur")}></input></label><br></br>
                            <label>Friday <input type="checkbox" id="lab_days" name="days[]" value="Fri" checked={formData.lab_days.includes("Fri")}></input></label><br></br>
                            </p>
                            <label>Duration: <input type="number" id="" name="duration" defaultValue={formData.duration}></input></label>
                            <label>Projector: <input type="checkbox" id="" name="projector" checked={formData.projector}></input></label>
                            <label>Time Range: 
                                <label>From: </label><input type="number" id="timerange_from" name="" defaultValue={formData.timerange_from}></input>
                                <label>Till: </label><input type="number" id="timerange_till" name="" defaultValue={formData.timerange_till}></input>
                            </label>
                        </fieldset>

                        

                    </form>

                    
                </div>
                <div className='course-data-buttons'>
                <button className='save-course-data'>Save Course Data</button>
                <button className='clear-course-data'>Clear</button>
                </div>
                <div className='data-table'>
                <table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Size</th>
                            <th>Cohorts</th>
                            <th>Combining Cohorts</th>
                            <th>Number of Tutors</th>
                            <th>Lectures</th>
                            <th>Lab Preferences</th>
                            <th>Drop in Preferences</th>
                        </tr>
                    </thead>
                    <tbody>
                        {course_data.map((course) => {
                            return(
                                <tr key={course.id}>
                                    <td>{course.id}</td>
                                    <td>{course.course_size}</td>
                                    <td>{course.cohorts}</td>
                                    <td>{course.mix_cohorts.toString()}</td>
                                    <td>{course.tutors}</td>
                                    <td>...</td>
                                    <td>...</td>
                                    <td>...</td>
                                    <td className='edit-collumn'>
                                        <button className='edit-button' onClick={() => updateFields(course)}>
                                            <i className="bi bi-pencil-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                </div>
            </div>

            
        </div>

    )
}
export default ManageData;