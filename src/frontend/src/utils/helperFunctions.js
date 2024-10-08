
import { parse } from 'papaparse';

const colorString = require('color-string')
const Color = require('color');

/**
 * Creates class objects from csv file uploads to firebase.
 * @param {csv} file 
 * @returns 
 */
export async function readFileData(file){

  //await deleteData("course_data", "ALL");
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
      course.course_code = (course.course_code).toString()
      delete course.drop_in_preferences

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
      uploadData("course_data", course)
    });
  }

  reader.readAsText(file);
  return;
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
 * Uploads new timetable to firebase with timestamp
 * @param {Array of Objects} timetable 
 */
export async function saveTimetable(timetable){
  uploadData("timetable_data", {timetable: timetable, created: new Date().toLocaleString()})
}

export function numToDay(value){
    switch(value){
      case "1":
        return("Monday")
      case "2":
        return("Tuesday")
      case "3":
        return("Wednesday")
      case "4":
        return("Thursday")
      case "5":
        return("Friday")
      default:
        throw new Error("Invalid Day")
    }
}

export async function prepCsv (data) {
  const timetable = data
  var csvData = []
  timetable.forEach(tutorial => {
    csvData.push({
      course_code: tutorial.course_code,
      title: tutorial.title, 
      location: tutorial.location, 
      startTime: tutorial.startTime, 
      endTime: tutorial.endTime, 
      day: numToDay(tutorial.daysOfWeek)
    })
  })
  csvData.sort((courseA, courseB) => courseA.title.localeCompare(courseB.title))
  return csvData
  
}

//The base URL which you query the data from. The URL is then generated into a query in the queryDatabase function
const databaseURL = "http://laballoc-dev.cecs.anu.edu.au:3001/api/";


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

export async function uploadData(collection, data){
  const query = databaseURL + "upload?collection=" + collection
  console.log(await fetch(query, {mode: "cors", method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)}))
}

export async function updateData(collection, target, data){
  console.log(JSON.stringify(data));
  const query = databaseURL + "update?collection=" + collection + (target ? "&target=" + target : "")
  console.log(await fetch(query, {mode: "cors", method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)}))
}

export async function deleteData(collection, target){
  const query = databaseURL + "delete?collection=" + collection + (target ? "&target=" + target : "")
  return(await fetch(query, {mode: "cors", method: "POST"}))
}


export const room_colours = {
  HN123: "#b4507f",
  HN124: "#c65f5d",
  N109: "#c67a2e",
  N111: "#c3b122",
  N112: "#6e9e2a",
  N113: "#258c6a",
  N114: "#3265b6",
  N1156: "#6f4abe"
};

/* PASTEL SCHEME 
export const room_colours = {
  HN123: "#81D4FA",
  HN124: "#FFCC80",
  N109: "#CE93DE",
  N111: "#FFAB91",
  N112: "#B39DDB",
  N113: "#80CBC4",
  N114: "#FFCDD2",
  N1156: "#FFECB3"
};
*/



export async function generateTimetable(raw_data){
  var timetable_data = raw_data;
  timetable_data.timetable.forEach(tutorial => {
    tutorial.backgroundColor = room_colours[(tutorial.location).replace(".", "").replace("/", "")]
    tutorial.borderColor = "#000000"
    tutorial.durationEditable = false;
    tutorial.editable = true;
    tutorial.overlap = true;
    tutorial.textColor = (Color(colorString.get(tutorial.backgroundColor).value).isDark() ? "#FFFFFF" : "#000000");
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
