import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import {collection, getDocs} from 'firebase/firestore'
import {db} from '../firebase';
import { useEffect } from 'react';
function ManageData(props){

    const [course_data, setCourseData] = useState([]);

    

    const fetchPost = async () => {
        await getDocs(collection(db, "course_data"))
            .then((querySnapshot)=>{               
                const newData = querySnapshot.docs.map((doc) => ({...doc.data(), key: doc.id}));
                setCourseData(newData);
            })
    }

    


    useEffect(() => {fetchPost();}, [])
    let x = {}
    course_data.forEach(c => {
        
    });
    

    return(
        <div className='data-table'>
            <NavBar navigate={props.navigate} tab={'manage-data'}></NavBar>
            <div className='data-table'>
            <table>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Size</th>
                        <th>Lectures</th>
                        <th>Lab Preferences</th>
                    </tr>
                </thead>
                <tbody>
                    {course_data.map((course) => {
                        return(
                            <tr>
                                <td>{course.id}</td>
                                <td>{course.course_size}</td>
                                <td>asd</td>
                                <td>asd</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
            
        </div>

    )
}
export default ManageData;