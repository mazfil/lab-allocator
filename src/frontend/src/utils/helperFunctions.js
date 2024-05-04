import { doc, setDoc } from "firebase/firestore";
import {collection, getDocs } from 'firebase/firestore'
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
  await setDoc(doc(database, "course_data_testing", course_code), course);
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

export function createRoomObject(){
  let roomObject = [];
  for(let i = 8; i < 20; i++){
    roomObject.push({})
    roomObject.push({ })
  }
  return roomObject;
}


/**
 * 
 * @returns Object with an array of tutorials in each room organised by their time
 */
export async function getRoomTimetables(){
  const timetable = await getData("timetable/"+(((await getData("timetable")).sort((a, b) => (a.created.seconds >= b.created.seconds) ? 1 : -1)))[0].id+"/tutorials");
  timetable.forEach(tutorial => {
    var colour;
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
    }
    tutorial.backgroundColor = colour;
    tutorial.eventStartEditable = true;
    tutorial.borderColor = "#000000"
  });
  console.log(timetable)
  return timetable;
}


