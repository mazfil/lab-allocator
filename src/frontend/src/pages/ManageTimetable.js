import './styles/ManageTimetable.css';
import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import { useEffect } from 'react';
import * as helpers from "../utils/helperFunctions.js";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { json2csv } from 'json-2-csv';

const colorString = require('color-string')
const Color = require('color');

function ManageTimetable(props){
    const rooms = ['HN1.23', 'HN1.24', 'N109', 'N111', 'N112', 'N113', 'N114', 'N115/6']

    // Tutorial data used by the calendar view. (applies filters to the timetable data)
    const [filteredTimetable, setFilteredData] = useState([]);

    // Full tutorial data from database
    const [timetable, setTimetable] = useState([]);
    
    // Determines which rooms are displayed at any time
    const [activeView, setView] = useState(rooms)

    // Displays either a specific course or all courses
    const [activeCourse, setCourseFilter] = useState("All")

    // The list of courses in the database
    const [courseList, setCourseList] = useState(["All"])

    // Time a specific timetable is created at when displayed
    const [createdTime, setTime] = useState(0);

    // List of all Timetables id that have been created
    const [storedTimetables, setTimetableList] = useState(['0'])

    // Filters the full course data based on rooms selected and which course has been selected
    const updateData = async (data, course) => {
        if(course === "All"){
            setFilteredData(await data.filter((tut) => activeView.includes(tut.location)))
        }else{
            setFilteredData(await data.filter((tut) => activeView.includes(tut.location)).filter((tut) => tut.title.includes(course)))
        }
    }

    // Saves the timetable to database
    const saveTimetable = async () => {
        helpers.saveTimetable(timetable)
    }

    // filters data based on which course is selected.
    const filterByCourse = async (e) => {
        await setCourseFilter(e.target.value);
        updateData(timetable, e.target.value)
    }

    const changeTimetable = async (e) => {
        const data = await helpers.generateTimetable(await helpers.queryDatabase("timetable_data", e.target.value))
        setTime(await data.created)
        initData(await data.timetable)
    }

    // Toggles the viewable rooms
    const toggleView = (room) => {
        var viewable = activeView;
        if(room === "All"){
          if(viewable.length != 8){
            rooms.forEach(room => {
              if(!viewable.includes(room)){
                viewable.push(room)
              }
            });
          }else{
            // Please note i have tried to just set viewable as [], but this does not trigger a re-render, 
            // therefore an inefficient loop is used :(
            rooms.forEach(room => {
              if(viewable.includes(room)){
                const rem = viewable.indexOf(room);
                viewable.splice(rem, 1)
              }
            });
          }
          setView(viewable)
          updateData(timetable, activeCourse);
        }else{
          if(viewable.includes(room)){
              const rem = viewable.indexOf(room);
              viewable.splice(rem, 1)
          }else{
              viewable.push(room)
          }
          setView(viewable)
          updateData(timetable, activeCourse);
        }
    }

    // updates a tutorial when dragged and dropped. Updates the time and day of tutorial.
    const updateTutorial = async (tutorial) => {
        if(tutorial.event.start.getHours() < 8 || tutorial.event.end.getHours() > 20){
          console.log("EOROREORO")
          tutorial.event = tutorial.oldEvent;
        }else{
          var editedTutorial = await timetable.find((tuts) => tuts.title === tutorial.event.title)
          editedTutorial.startTime = tutorial.event.start.getHours() + ":" + (tutorial.event.start.getMinutes() === 0 ? "00" : "30")
          editedTutorial.endTime = tutorial.event.end.getHours() + ":" + (tutorial.event.end.getMinutes() === 0 ? "00" : "30")
          editedTutorial.daysOfWeek = tutorial.event.start.getDay().toString()
          updateData(timetable, activeCourse)
        }
        
    }

    // Value for whether or not to render the room change overlay
    const [changeRoomVisibility, setVisibility] = useState(false);

    // sets the tutorial which is being modified
    const [pendingRoomChange, setPendingRoom] = useState([]);
    const [availRooms, setAvailRooms] = useState(['HN123', 'HN124', 'N109', 'N111', 'N112', 'N113', 'N114', 'N1156']);

    // Hides or Shows change room overlay
    const toggleChangeRoom = () => {
        setVisibility(!changeRoomVisibility);
    }

    const roomsAvail = () =>{

    }

    // Prevents the overlay panel from closing when clicking 
    const stopCRClose = (event) => {
        event.stopPropagation();
    }

    // initiates the change of room event when a tutorial is clicked
    const triggerChangeRoom = (tutorial) =>{
        setPendingRoom(tutorial)
        toggleChangeRoom()
    }

    const clashCheck = (tutorial, room) =>{
        var clash = false;
        var current = timetable.find(tut => tut.title === tutorial.event.title);
        var potentialClashes = timetable.filter(otherTutorial => { return otherTutorial.location === room }).filter(otherTutorial => (otherTutorial.daysOfWeek === current.daysOfWeek))
        potentialClashes.forEach(potentialClash => {
            if (!(parseInt(current.startTime.split(':')[0]) <= parseInt(potentialClash.endTime.split(':')[0]) && parseInt(current.endTime.split(':')[0]) <= parseInt(potentialClash.startTime.split(':')[0]))){
              clash = true;
            }
        });
        if(!clash){
          return helpers.room_colours[(room).replace(".", "").replace("/", "")]
        }else{
          return "#333333"
        }
        
        
    }

    const checkRoomSize = (tutorial, room) => {
      console.log(tutorial)
      if (helpers.roomSizes[(tutorial.event._def.extendedProps.location).replace(".", "").replace("/", "")] < helpers.roomSizes[(room).replace(".", "").replace("/", "")]){
        return "#FF0000";
      }else{
        return "#FFFFFF";
      }
    }

    // Changes the room for a tutorial after a room is selected on the changeRoom overlay
    // TODO: fix the clash check, overwrites existing tutorials when the room is the same
    const changeRoom = async (tutorial, room) => {
      
      var current = await timetable.find(tut => tut.title === tutorial.event.title);
      console.log(current)
        var clash = false;
        var potentialClashes = await timetable.filter(otherTutorial => { return otherTutorial.location === room }).filter(otherTutorial => (otherTutorial.daysOfWeek === current.daysOfWeek))
        potentialClashes.forEach(potentialClash => {
            if (!(parseInt(current.startTime.split(':')[0]) <= parseInt(potentialClash.endTime.split(':')[0]) && parseInt(current.endTime.split(':')[0]) <= parseInt(potentialClash.startTime.split(':')[0]))){
                clash = true;
                console.log("A CLASH")
            }
        });
        if (!clash){
            current.location = room
            current.backgroundColor = helpers.room_colours[(current.location).replace(".", "").replace("/", "")]
            await setTimetable(timetable)
            await updateData(timetable, activeCourse);
            await toggleChangeRoom();
            pendingRoomChange.event.setProp('title', current.title)
            pendingRoomChange.event.setProp('backgroundColor', current.backgroundColor)
            pendingRoomChange.event.setProp('textColor', (Color(colorString.get(current.backgroundColor).value).isDark() ? "#FFFFFF" : "#000000"))

        }else{
            console.log("ERROR CLASH")
        }
    }


    // Downloads the course data as a CSV
    const downloadFile = async () => {
      await helpers.prepCsv(timetable).then(data => {
            var blob = new Blob([json2csv(data, {excludeKeys: ["backgroundColor", "durationEditable", "borderColor", "overlap", "editable", "daysOfWeek", "_id", "textColor"]})], { type: "csv" });
            var a = document.createElement('a');
            a.download = "timetable.csv";
            a.href = URL.createObjectURL(blob);
            a.dataset.downloadurl = ["csv", a.download, a.href].join(':');
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
        })
    }

    // initData and fetchPost initialise the data when the page is opened.
    const initData = async (data) => {
        
        // Create the list of all course codes
        var codes = [];
        for (let course of new Set(data.map(item => item.course_code))){
          codes.push(course);
        }

        setTimetable(data)
        setCourseList(["All", ...codes.sort()])
        updateData(data, "All")
    }

    const fetchPost = async () => {
        const data = await helpers.generateTimetable(await helpers.queryDatabase("timetable_data"))
        setTimetableList((await helpers.queryDatabase("timetable_data", "list")).map(({ _id }) => _id))

        //const data = await helpers.generateTimetable(fileData)
        setTime(await data.created)
        initData(await data.timetable)
    }
    useEffect(() => {fetchPost();}, [])
    
    return(
        <div className='manageTimetable'>
            {/* This conditionall renders the room change overlay. When a tutorial is clicked, 
                    the changeRoomVisibility is set to true and the overlay is displayed   */}
            {changeRoomVisibility ? 
                <div className='change-room-overlay' onClick={toggleChangeRoom}>
                  <div className='change-room'>
                    <div className='change-room-main' onClick={stopCRClose}>
                        <h2>Move {pendingRoomChange.event.title} to: </h2><br />
                        <div className='change-room-buttons'>
                            <button style={{backgroundColor: clashCheck(pendingRoomChange, "HN1.23"), borderColor: checkRoomSize(pendingRoomChange, "HN1.23"), borderWidth: "4px"}} onClick={() => {changeRoom(pendingRoomChange, "HN1.23")}}>HN1.23</button>
                            <button style={{backgroundColor: clashCheck(pendingRoomChange, "HN1.24"), borderColor: checkRoomSize(pendingRoomChange, "HN1.24"), borderWidth: "4px"}} onClick={() => {changeRoom(pendingRoomChange, "HN1.24")}}>HN1.24</button>
                            <button style={{backgroundColor: clashCheck(pendingRoomChange, "N109"), borderColor: checkRoomSize(pendingRoomChange, "N109"), borderWidth: "4px"}} onClick={() => {changeRoom(pendingRoomChange, "N109")}}>N109</button>
                            <button style={{backgroundColor: clashCheck(pendingRoomChange, "N111"), borderColor: checkRoomSize(pendingRoomChange, "N111"), borderWidth: "4px"}} onClick={() => {changeRoom(pendingRoomChange, "N111")}}>N111</button>
                            <button style={{backgroundColor: clashCheck(pendingRoomChange, "N112"), borderColor: checkRoomSize(pendingRoomChange, "N112"), borderWidth: "4px"}} onClick={() => {changeRoom(pendingRoomChange, "N112")}}>N112</button>
                            <button style={{backgroundColor: clashCheck(pendingRoomChange, "N113"), borderColor: checkRoomSize(pendingRoomChange, "N113"), borderWidth: "4px"}} onClick={() => {changeRoom(pendingRoomChange, "N113")}}>N113</button>
                            <button style={{backgroundColor: clashCheck(pendingRoomChange, "N114"), borderColor: checkRoomSize(pendingRoomChange, "N114"), borderWidth: "4px"}} onClick={() => {changeRoom(pendingRoomChange, "N114")}}>N114</button>
                            <button style={{backgroundColor: clashCheck(pendingRoomChange, "N115/6"), borderColor: checkRoomSize(pendingRoomChange, "N115/6"), borderWidth: "4px"}} onClick={() => {changeRoom(pendingRoomChange, "N115/6")}}>N115/6</button>
                        </div>
                        
                    </div>
                    <br />
                    <p className="change-room-info"><i class="bi bi-info-circle"></i> Rooms with smaller capacities are outlined in Red.</p> 
                  </div>
                    
                </div>
                : null
            }


            <NavBar navigate={props.navigate} tab={'manage-timetable'}></NavBar>

            {/* The filter which shows which course is displayed on the calendar
                        Gets all individual course codes from the data       */}
            <div className='timetable-calendar'>
                <div className='course-filter'>
                    <label for="course-filter">Filter By Course</label>
                    <select id="filter-by-course" onChange={filterByCourse}>
                        {courseList.map((code) => (
                            <option value={code}>{code}</option>
                        ))}
                    </select>
                    
                </div>
                <div className='tutorial-visibility'>
                  <button 
                  onClick={() => toggleView("HN1.23")} 
                  style={activeView.includes("HN1.23") ? {backgroundColor: helpers.room_colours.HN123, borderColor: helpers.room_colours.HN123, color: (Color(colorString.get(helpers.room_colours.HN123).value).isDark() ? "#FFFFFF" : "#000000")} : {backgroundColor: "#444444"}}>
                    HN1.23</button>

                  <button 
                  onClick={() => toggleView("HN1.24")} 
                  style={activeView.includes("HN1.24") ? {backgroundColor: helpers.room_colours.HN124, borderColor: helpers.room_colours.HN124, color: (Color(colorString.get(helpers.room_colours.HN124).value).isDark() ? "#FFFFFF" : "#000000")} : {backgroundColor: "#444444"}}>
                    HN1.24</button>

                  <button 
                  onClick={() => toggleView("N109")} 
                  style={activeView.includes("N109") ? {backgroundColor: helpers.room_colours.N109, borderColor: helpers.room_colours.N109, color: (Color(colorString.get(helpers.room_colours.N109).value).isDark() ? "#FFFFFF" : "#000000")} : {backgroundColor: "#444444"}}>
                    N109</button>

                  <button 
                  onClick={() => toggleView("N111")} 
                  style={activeView.includes("N111") ? {backgroundColor: helpers.room_colours.N111, borderColor: helpers.room_colours.N111, color: (Color(colorString.get(helpers.room_colours.N111).value).isDark() ? "#FFFFFF" : "#000000")} : {backgroundColor: "#444444"}}>
                    N111</button>

                  <button 
                  onClick={() => toggleView("N112")} 
                  style={activeView.includes("N112") ? {backgroundColor: helpers.room_colours.N112, borderColor: helpers.room_colours.N112, color: (Color(colorString.get(helpers.room_colours.N112).value).isDark() ? "#FFFFFF" : "#000000")} : {backgroundColor: "#444444"}}>
                    N112</button>

                  <button 
                  onClick={() => toggleView("N113")}
                  style={activeView.includes("N113") ? {backgroundColor: helpers.room_colours.N113, borderColor: helpers.room_colours.N113, color: (Color(colorString.get(helpers.room_colours.N113).value).isDark() ? "#FFFFFF" : "#000000")} : {backgroundColor: "#444444"}}>
                    N113</button>

                  <button 
                  onClick={() => toggleView("N114")} 
                  style={activeView.includes("N114") ? {backgroundColor: helpers.room_colours.N114, borderColor: helpers.room_colours.N114, color: (Color(colorString.get(helpers.room_colours.N114).value).isDark() ? "#FFFFFF" : "#000000")} : {backgroundColor: "#444444"}}>
                    N114</button>

                  <button 
                  onClick={() => toggleView("N115/6")} 
                  style={activeView.includes("N115/6") ? {backgroundColor: helpers.room_colours.N1156, borderColor: helpers.room_colours.N1156, color: (Color(colorString.get(helpers.room_colours.N1156).value).isDark() ? "#FFFFFF" : "#000000")} : {backgroundColor: "#444444"}}>
                    N115/6</button>
                  
                  <button onClick={() => toggleView("All")}>All</button>
                </div>
                <div className="calendar-view">
              {/* See https://fullcalendar.io/docs#toc for documentation of calendar view */}
              <FullCalendar
                plugins={[ timeGridPlugin, interactionPlugin ]}
                initialView="timeGridWeek"
                weekends={false}
                slotMinTime={"07:00:00"}
                slotMaxTime={"21:00:00"}
                initialDate={"2024-01-01"}
                dayHeaderFormat={{ weekday: 'short' }}
                height={"auto"}
                headerToolbar={{
                    start: '', // will normally be on the left. if RTL, will be on the right
                    center: '',
                    end: '' // will normally be on the right. if RTL, will be on the left
                }}
                businessHours={{
                  daysOfWeek: [ 1, 2, 3, 4, 5 ],
                  startTime: '08:00',
                  endTime: '20:00'
                }}
                eventConstraint={"businessHours"}
                allDaySlot={false}
                events={filteredTimetable}
                eventDrop={function(event){updateTutorial(event)}}
                eventClick={function(event){triggerChangeRoom(event)}}
                eventOverlap={function(still, moving){return !(still._def.extendedProps.location === moving._def.extendedProps.location)}}
                />
                </div>
                
            </div>
            <div className='bottom-bar'>
                <div className='manage-timetable-buttons'>
                    <button className='timetable-save' onClick={saveTimetable}>Save</button>
                    <button className='timetable-save' onClick={downloadFile}>Download</button>
                </div>
                <div>
                  <p className='created'><b>Timetable Created</b> {createdTime}</p>
                  <div className='timetable-filter'>
                      <label for="timetable-filter">Edit Timetable: </label>
                      <select id="filter-by-timetable" onChange={changeTimetable}>
                          {storedTimetables.map((id) => (
                            <option value={id}>{new Date(parseInt(id.substring(0, 8), 16)*1000).toLocaleString()}</option>
                          ))}
                      </select>
                  </div>
                </div>
                
            </div>
        </div>
    );
}
export default ManageTimetable;
