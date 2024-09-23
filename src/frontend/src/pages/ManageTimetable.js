import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import { useEffect } from 'react';
import * as helpers from "../utils/helperFunctions.js";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { mkConfig, generateCsv, download } from "export-to-csv";
import { json2csv } from 'json-2-csv';
import { create } from '@mui/material/styles/createTransitions.js';

import fileData from "../TEMPDATA.json"

function ManageTimetable(props){
    // Tutorial data used by the calendar view. (applies filters to the timetable data)
    const [filteredTimetable, setFilteredData] = useState([]);

    // Full tutorial data from database
    const [timetable, setTimetable] = useState([]);

    // Determines which rooms are displayed at any time
    const [activeView, setView] = useState(['HN1.23', 'HN1.24', 'N109', 'N111', 'N112', 'N113', 'N114', 'N115/6'])

    // Displays either a specific course or all courses
    const [activeCourse, setCourseFilter] = useState(["All"])

    // The list of courses in the database
    const [courseList, setCourseList] = useState(["All"])

    // config for downloading data
    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    // Time a specific timetable is created at when displayed
    const [createdTime, setTime] = useState(0);

    // Filters the full course data based on rooms selected and which course has been selected
    const updateData = async (data, course) => {
        if(course != "All"){
            setFilteredData(data.filter((tut) => activeView.includes(tut.location)).filter((tut) => tut.title.includes(course)))
        }else{
            setFilteredData(data.filter((tut) => activeView.includes(tut.location)))
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

    // Toggles the viewable rooms
    const toggleView = (room) => {
        var viewable = activeView;
        if(viewable.includes(room)){
            const rem = viewable.indexOf(room);
            viewable.splice(rem, 1)
        }else{
            viewable.push(room)
        }
        setView(viewable)
        updateData(timetable, activeCourse);
    }

    // updates a tutorial when dragged and dropped. Updates the time and day of tutorial.
    const updateTutorial = async (tutorial) => {
        console.log(tutorial)
        var editedTutorial = await timetable.find((tuts) => tuts._id == tutorial.event.title)
        console.log(editedTutorial)
        editedTutorial.startTime = tutorial.event.start.getHours() + ":" + (tutorial.event.start.getMinutes() == 0 ? "00" : "30")
        editedTutorial.endTime = tutorial.event.end.getHours() + ":" + (tutorial.event.end.getMinutes() == 0 ? "00" : "30")
        editedTutorial.daysOfWeek = tutorial.event.start.getDay().toString()
        updateData(timetable, activeCourse)
    }

    // Value for whether or not to render the room change overlay
    const [changeRoomVisibility, setVisibility] = useState(false);

    // sets the tutorial which is being modified
    const [pendingRoomChange, setPendingRoom] = useState([]);

    // Hides or Shows change room overlay
    const toggleChangeRoom = () => {
        setVisibility(!changeRoomVisibility);
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

    // Changes the room for a tutorial after a room is selected on the changeRoom overlay
    // TODO: fix the clash check, overwrites existing tutorials when the room is the same
    const changeRoom = async (tutorial, room) => {
      console.log(tutorial)
      var current = await timetable.find(tut => tut.course_code === tutorial.event.title);
      console.log(current)
        var clash = false;
        var potentialClashes = await timetable.filter(otherTutorial => { return otherTutorial.location == room }).filter(otherTutorial => (otherTutorial.daysOfWeek == current.daysOfWeek))

        potentialClashes.forEach(potentialClash => {
            if ((current.end <= potentialClash.start || potentialClash.end <= current.start)){
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
        }else{
            console.log("ERROR CLASH")
        }
    }

    // Downloads the course data as a CSV
    const downloadFile = async () => {
        const fileData = await helpers.numToDay(timetable).then(data => {
            var blob = new Blob([json2csv(data, {excludeKeys: ["backgroundColor", "durationEditable", "borderColor", "overlap", "editable", "daysOfWeek"]})], { type: "csv" });
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

    //-----------------------------------------------------------
    // TEMP COMMENT TO DIFFERENTIATE NEW CODE FROM OLD CODE









    // initData and fetchPost initialise the data when the page is opened.
    const initData = async (data) => {
        setTimetable(data)
        setCourseList(["All", ...new Set(data.map(item => item.title.substring(0, item.title.indexOf('_'))))].slice(0, -1))
        updateData(data, activeCourse)
    }

    const fetchPost = async () => {
        // SWITCH ONCE READY TO USE DATABASE
        //const data = await helpers.generateTimetable(await helpers.queryDatabase("timetable_data"))
        const data = await helpers.generateTimetable(fileData)
        setTime(data.created)
        initData(data.timetable)
        console.log(await data)
    }
    useEffect(() => {fetchPost();}, [])
    
    return(
        <div className='manageTimetable'>
            {/* This conditionall renders the room change overlay. When a tutorial is clicked, 
                    the changeRoomVisibility is set to true and the overlay is displayed   */}
            {changeRoomVisibility ? 
                <div className='change-room-overlay' onClick={toggleChangeRoom}>
                    <div className='change-room' onClick={stopCRClose}>
                        <p>Move {pendingRoomChange.event.id} to</p>
                        <div className='change-room-buttons'>
                            <button onClick={() => {changeRoom(pendingRoomChange, "HN1.23")}}>HN1.23</button>
                            <button onClick={() => {changeRoom(pendingRoomChange, "HN1.24")}}>HN1.24</button>
                            <button onClick={() => {changeRoom(pendingRoomChange, "N109")}}>N109</button>
                            <button onClick={() => {changeRoom(pendingRoomChange, "N111")}}>N111</button>
                            <button onClick={() => {changeRoom(pendingRoomChange, "N112")}}>N112</button>
                            <button onClick={() => {changeRoom(pendingRoomChange, "N113")}}>N113</button>
                            <button onClick={() => {changeRoom(pendingRoomChange, "N114")}}>N114</button>
                            <button onClick={() => {changeRoom(pendingRoomChange, "N115/6")}}>N115/6</button>
                        </div>
                        
                    </div>
                </div>
                : null
            }


            <NavBar navigate={props.navigate} tab={'manage-data'}></NavBar>

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
                  <button onClick={() => toggleView("HN1.23")} style={activeView.includes("HN1.23") ? {backgroundColor: helpers.room_colours.HN123} : {backgroundColor: "#444444"}}>HN1.23</button>
                  <button onClick={() => toggleView("HN1.24")} style={activeView.includes("HN1.24") ? {backgroundColor: helpers.room_colours.HN124} : {backgroundColor: "#444444"}}>HN1.24</button>
                  <button onClick={() => toggleView("N109")} style={activeView.includes("N109") ? {backgroundColor: helpers.room_colours.N109} : {backgroundColor: "#444444"}}>N109</button>
                  <button onClick={() => toggleView("N111")} style={activeView.includes("N111") ? {backgroundColor: helpers.room_colours.N111} : {backgroundColor: "#444444"}}>N111</button>
                  <button onClick={() => toggleView("N112")} style={activeView.includes("N112") ? {backgroundColor: helpers.room_colours.N112} : {backgroundColor: "#444444"}}>N112</button>
                  <button onClick={() => toggleView("N113")} style={activeView.includes("N113") ? {backgroundColor: helpers.room_colours.N113} : {backgroundColor: "#444444"}}>N113</button>
                  <button onClick={() => toggleView("N114")} style={activeView.includes("N114") ? {backgroundColor: helpers.room_colours.N114} : {backgroundColor: "#444444"}}>N114</button>
                  <button onClick={() => toggleView("N115/6")} style={activeView.includes("N115/6") ? {backgroundColor: helpers.room_colours.N1156} : {backgroundColor: "#444444"}}>N115/6</button>
                </div>
                {/* See https://fullcalendar.io/docs#toc for documentation of calendar view */}
                <FullCalendar
                plugins={[ timeGridPlugin, interactionPlugin ]}
                initialView="timeGridWeek"
                weekends={false}
                slotMinTime={"08:00:00"}
                slotMaxTime={"21:00:00"}
                initialDate={"2024-01-01"}
                dayHeaderFormat={{ weekday: 'short' }}
                height={"auto"}
                headerToolbar={{
                    start: '', // will normally be on the left. if RTL, will be on the right
                    center: '',
                    end: '' // will normally be on the right. if RTL, will be on the left
                }}
                allDaySlot={false}
                events={filteredTimetable}
                eventDrop={function(event){updateTutorial(event)}}
                eventClick={function(event){triggerChangeRoom(event)}}
                eventOverlap={function(still, moving){return !(still._def.extendedProps.location === moving._def.extendedProps.location)}}
                />
            </div>
            <div className='bottom-bar'>
                <div className='manage-timetable-buttons'>
                    <button className='timetable-save' onClick={saveTimetable}>Save</button>
                    <button className='timetable-save' onClick={downloadFile}>Download</button>
                </div>
                <p className='created'><b>Timetable Created</b> {createdTime}</p>
            </div>
        </div>
    );
}
export default ManageTimetable;
