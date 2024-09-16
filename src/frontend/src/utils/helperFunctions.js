import { doc, setDoc } from "firebase/firestore";
import {collection, getDocs, Timestamp } from 'firebase/firestore'
import {database} from '../firebase';
import { parse } from 'papaparse';
import { ObjectId } from "bson";


/**
 * Creates class objects from csv file uploads to firebase.
 * @param {csv} file 
 * @param {database ref} db 
 * @returns 
 */
export async function readFileData(file){
  await deleteData("course_data", "ALL");
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
      course.lectures = [];
      ["lec_1", "lec_2", "lec_3", "lec_4"]
      .forEach(lecture => {
        if (course[lecture] != null) { course.lectures.push(course[lecture]) }
        delete course[lecture]
      });

      // Nests Tutorial Preferences
      course.tutorial_properties = {};
      ["after_lecture", "byod", "projector", "tut_days", "tut_duration", "tut_end_time", "tut_start_time"]
      .forEach(property => {
        course.tutorial_properties[property] = course[property]
        delete course[property]
      });
      uploadData("course_data", course.course_code, course)
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
  await fetch();
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

//The base URL which you query the data from. The URL is then generated into a query in the queryDatabase function
const databaseURL = "http://laballoc-dev.cecs.anu.edu.au:3002/api/";


/**
 * Generates a request and then sends to the Database API to handle
 * @param {String} collection the collection which is being queried (course_data or timetable_data)
 * @param {String} target a specific document which should be fetched or modified
 * @returns 
 */
export async function queryDatabase(collection, target){
  const query = databaseURL + "data?collection=" + collection + (target ? "&target=" + target : "")
  return(await fetch(query, {mode: "cors", method: "GET"}).then((e) => e.json()).then((json) => {return(json)}))
}

export async function uploadData(collection, target, data){
  const query = databaseURL + "upload?collection=" + collection + (target ? "&target=" + target : "")
  console.log(await fetch(query, {mode: "cors", method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)}))
}

export async function updateData(collection, target, data){
  const query = databaseURL + "update?collection=" + collection + (target ? "&target=" + target : "")
  console.log(await fetch(query, {mode: "cors", method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)}))
}


export async function deleteData(collection, target){
  const query = databaseURL + "delete?collection=" + collection + (target ? "&target=" + target : "")
  return(await fetch(query, {mode: "cors", method: "POST"}))
}


export const room_colours = {
  HN123: "#beb2b4",
  HN124: "#a899a4",
  N109: "#928293",
  N111: "#655071",
  N112: "#514b63",
  N113: "#3e4454",
  N114: "#4c5669",
  N1156: "#626e85"
};


export async function generateTimetable(raw_data){
  var timetable_data = raw_data;
  timetable_data.timetable.forEach(tutorial => {
    tutorial.backgroundColor = room_colours[(tutorial.location).replace(".", "").replace("/", "")]
    tutorial.borderColor = "#000000"
    tutorial.durationEditable = false;
    tutorial.editable = true;
    tutorial.overlap = true;
    tutorial.course_code = tutorial.title;
    tutorial.title = tutorial._id
  });

  return(timetable_data)
}





export async function queryLogs(){
  const query = databaseURL + "logs";
  return(await fetch(query, {mode: "cors", method: "GET"}).then((e) => e.json()).then((json) => {return(json)}))
}

export async function createLog(log_type, log_message){
  const log = {type: log_type, message: log_message}
  const query = databaseURL + "logs";
  console.log(await fetch(query, {mode: "cors", method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify(log)}))
}
