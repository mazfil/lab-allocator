import { doc, setDoc, where } from "firebase/firestore";
import {collection, getDocs, query} from 'firebase/firestore'
import {database} from '../firebase';

/**
 * Creates class objects from csv file uploads to firebase.
 * @param {csv} file 
 * @param {database ref} db 
 * @returns 
 */
export async function readFileData(file, db){
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      var lines=reader.result.toString().split("\n");
      var result = [];
      var headers=lines[0].split(",");
      headers[headers.length - 1] = headers[headers.length - 1].slice(0, -1); 
      
      for(var i=1;i<lines.length;i++){
          var obj = {};
          var currentline=lines[i].split(",");
          for(var j=0;j<headers.length;j++){
              obj[headers[j]] = currentline[j];
          }
          result.push(obj);
      }

      result.pop();
      

      result.forEach(course => {
        if(course.course_code != null){
          course.time_range = course.time_range.split(" ").map(Number);
          course.days = course.days.split(" ")
          course.lectures = course.lectures.split(" ")
          course.lectures[course.lectures.length -1] = course.lectures[course.lectures.length -1].slice(0, -1);
          
          for(let i = 0; i < course.lectures.length; i++){
            var lec = course.lectures.splice(0, 3);
            lec[1] = parseInt(lec[1])
            lec[2] = parseInt(lec[2])
            course.lectures.push(lec)

          }
          course.after_lecture = course.after_lecture === 'TRUE';
          course.byod = course.byod === 'TRUE';
          course.mix_cohorts = course.mix_cohorts === 'TRUE';
          course.projector = course.projector === 'TRUE';
          course.course_size = parseInt(course.course_size)
          course.cohorts = parseInt(course.cohorts)
          course.duration = parseInt(course.duration)
          course.tutors = parseInt(course.tutors)

          course.lab_preferences = {}
          moveToNestedElement(course, 'lab_preferences', 'after_lecture', course.after_lecture)
          moveToNestedElement(course, 'lab_preferences', 'byod', course.byod)
          moveToNestedElement(course, 'lab_preferences', 'days', course.days)
          moveToNestedElement(course, 'lab_preferences', 'duration', course.duration)
          moveToNestedElement(course, 'lab_preferences', 'projector', course.projector)
          moveToNestedElement(course, 'lab_preferences', 'time_range', course.time_range)
          
          course.lectures = Object.assign({}, course.lectures)
          

        }
        
      });

    uploadCourseData(result, db)
    return (result)
    }
    return null;
}

/**
 * Moves object parameter from main object to nested object within the main object
 * @param {Object} mainObject 
 * @param {Object} nestedObject 
 * @param {Key} key 
 * @param {Value} value 
 */
export function moveToNestedElement(mainObject, nestedObject, key, value){
  mainObject[nestedObject][key] = value;
  delete mainObject[key]

}

/**
 * Uplaods course data to firestore.
 * @param {Array<Object>} course_data 
 * @param {database ref} db 
 */
export async function uploadCourseData(course_data, db){
  await course_data.forEach(course => {
    const course_code = course.course_code;
    delete course[course_code]
    setDoc(doc(db, "course_data", course_code), course);
  });
}

/**
 * Returns the data of the specified document in the database
 * @param {String} document
 * @returns Array of Data
 */
export async function getData(document){
  return await getDocs(collection(database, document))
            .then((querySnapshot)=>{               
                return querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
            })
}

export function createRoomObject(){
  let roomObject = [];
  for(let i = 8; i < 20; i++){
    roomObject.push({})
    roomObject.push({ })
  }
  return roomObject;
}

function dayToNum(day){
  switch (day){
    case "Mon":
      return "1";
    case "Tue":
      return "2";
    case "Wed":
      return "3";
    case "Thur":
      return "4";
    case "Fri":
      return "5";
  }
}

/**
 * 
 * @returns Object with an array of tutorials in each room organised by their time
 */
export async function getRoomTimetables(){
  const timetable = await getData("timetable/"+(await getData("timetable"))[0].id+"/tutorials");
  const calendarData = [];

  timetable.forEach(tutorial => {
    calendarData.push({
      start: "2024-01-01",
      end: "2024-30-12",
      startTime: tutorial.time+":00:00",
      endTime: (tutorial.time + (tutorial.length / 60)) + ":00:00",
      daysOfWeek: dayToNum(tutorial.day),
      title: tutorial.id,
      editable: true,
      overlap: true
    })
  });

  console.log(calendarData)
  return calendarData;
}