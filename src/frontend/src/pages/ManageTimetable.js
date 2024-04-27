import {Component} from 'react';
import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import {collection, getDocs, get} from 'firebase/firestore'
import { useEffect } from 'react';
import * as helpers from "../utils/helperFunctions.js";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'

function ManageTimetable(props){
    const [timetable, setTimetable] = useState([]);

    const fetchPost = async () => {
        setTimetable(await helpers.getRoomTimetables());
    }

    useEffect(() => {fetchPost();}, [])


    return(
        <div className='manageTimetable'>
            <FullCalendar
            plugins={[ timeGridPlugin ]}
            initialView="timeGridWeek"
            weekends={false}
            slotMinTime={"08:00:00"}
            slotMaxTime={"21:00:00"}
            initialDate={"2024-01-01"}
            dayHeaderFormat={{ weekday: 'short' }}
            customButtons={
                { 
                    HN123: {text: 'HN1.23', click: function() {alert('clicked the custom button!');}},
                    HN124: {text: 'HN1.24', click: function() {alert('clicked the custom button!');}},
                    N109: {text: 'N109', click: function() {alert('clicked the custom button!');}},
                    N111: {text: 'N111', click: function() {alert('clicked the custom button!');}},
                    N112: {text: 'N112', click: function() {alert('clicked the custom button!');}},
                    N113: {text: 'N113', click: function() {alert('clicked the custom button!');}},
                    N114: {text: 'N114', click: function() {alert('clicked the custom button!');}},
                    N1156: {text: 'N115/6', click: function() {alert('clicked the custom button!');}},
                }}
            headerToolbar={{
                start: '', // will normally be on the left. if RTL, will be on the right
                center: 'HN123 HN124 N109 N111 N112 N113 N114 N1156',
                end: '' // will normally be on the right. if RTL, will be on the left
              }}
            events={timetable}
            />
        </div>
    );
}
export default ManageTimetable;

