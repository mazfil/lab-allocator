import { doc, setDoc } from "firebase/firestore";
import {collection, getDocs, Timestamp } from 'firebase/firestore'
import {database} from '../firebase';
import { parse } from 'papaparse';


/**
 * Creates class objects from csv file uploads to firebase.
 * @param {csv} file 
 * @param {database ref} db 
 * @returns 
 */
export async function readFileData(file){
  const parseOptions = {
    header: true,
    dynamicTyping: true,
    transform: (value, header) => {return convertData(value, header)}
  }

  var reader = new FileReader();
  reader.onload = function(e) {
    // Remove the excel header so header is replaced with code friendly header.
    var lines = reader.result.split("\n");
    lines.splice(0, 1);
    var course_data = parse(lines.join("\n"), parseOptions).data

    // Nests the lectures and tutorial preferences in the course object
    // uploads course object to firebase.
    course_data.forEach(course => {
      if(course.course_code == null){
        return;
      }

      // Nests lectures
      course.lectures = {};
      ["lec_1", "lec_2", "lec_3", "lec_4"]
      .forEach(lecture => {
        if (course[lecture] != null) { course.lectures[lecture] = course[lecture] }
        delete course[lecture]
      });

      // Nests Tutorial Preferences
      course.tutorial_properties = {};
      ["after_lecture", "byod", "projector", "tut_days", "tut_duration", "tut_end_time", "tut_start_time"]
      .forEach(property => {
        course.tutorial_properties[property] = course[property]
        delete course[property]
      });

      uploadCourse(course);
    });
  }

  reader.readAsText(file);
  return;
}


/**
 * Uploads single course element to firebase
 * @param {Object} course - Object that is uploaded to course_data document
 */
async function uploadCourse(course){
  const course_code = course.course_code;
  delete course[course_code]
  await setDoc(doc(database, "course_data", course_code), course);
}


/**
 * Returns csv spreadsheet data as usable variable types.
 * @param {Value} value - The variable that is converted
 * @param {String} header - Header of the variable being converted
 * @returns Converted Variable
 */
function convertData(value, header){
  if (value === ""){
    return null
  }
  switch (value) {
    case "Yes":
      return true;
    case "No":
      return false;
    default:
      break;
  }

  switch (header) {
    case "tut_days":
      return value.split(';');
    case "lec_1":
    case "lec_2":
    case "lec_3":
    case "lec_4":
      var lec = value.split(";");
      return({ day: lec[0], time: Number(lec[1]), duration: Number(lec[2]) })
    default:
      return value;
  }
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


/**
 * Creates the array of tutorials for display on the fullcalendar
 * @returns Object with an array of tutorials in each room organised by their time
 */
export async function getRoomTimetables(){
  var timetable = (((await getData("timetable")).sort((a, b) => (a.created.seconds <= b.created.seconds) ? 1 : -1)))[0];
  const timetable_created = timetable.created.seconds
  const timetable_data = await getData("timetable/"+timetable.id+"/tutorials");
  timetable_data.forEach(tutorial => {
    /*var colour;
    switch(tutorial.location){
      case("HN1.23"):
        colour = "#ea5545";
        break;
      case("HN1.24"):
        colour = "#f46a9b";
        break;
      case("N109"):
        colour = "#ef9b20";
        break;
      case("N111"):
        colour = "#ede15b";
        break;
      case("N112"):
        colour = "#bdcf32";
        break;
      case("N113"):
        colour = "#87bc45";
        break;
      case("N114"):
        colour = "#27aeef";
        break;
      case("N115/6"):
        colour = "#b33dc6";
        break;
      default:
        colour = '#333333'
    }*/
    tutorial.backgroundColor = "#585868";
    tutorial.durationEditable = false
    tutorial.borderColor = "#000000"
    tutorial.title = tutorial.id + "\n" + tutorial.location
  });

  console.log(Date.now())
  console.log(timetable_created*1000)
  
  return [timetable_data, new Date(timetable_created*1000).toLocaleString()];
}


/**
 * Uploads new timetable to firebase with timestamp
 * @param {Array of Objects} timetable 
 */
export async function saveTimetable(timetable){
  const time = Date.now()
  const loc = "timetable/" + time  
  timetable.forEach(tutorial => {
    setDoc(doc(database, loc + "/tutorials", tutorial.id), tutorial);
  });
  const timetableRef = doc(database, "timetable", time.toString());
  setDoc(timetableRef, {created: Timestamp.now()}, {merge: true});
}

export async function numToDay(data){
  const result = data
  result.forEach(course => {
    switch(course.daysOfWeek ){
      case "1":
        course.day = "Monday"
        break;
      case "2":
        course.day = "Tuesday"
        break;
      case "3":
        course.day = "Wednesday"
        break;
      case "4":
        course.day = "Thursday"
        break;
      case "5":
        course.day = "Friday"
        break;
    }
    
  });
  return result
}

const databaseURL = "http://laballoc-dev.cecs.anu.edu.au:3001/api/data";

export async function queryDatabase(collection, target){
  const query = databaseURL + "?collection=" + collection + (target ? "&target=" + target : "")
  return await fetch(query, {method: "GET"})
}