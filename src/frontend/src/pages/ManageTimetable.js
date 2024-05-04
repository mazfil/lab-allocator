import {Component} from 'react';
import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import {collection, getDocs, get} from 'firebase/firestore'
import { useEffect } from 'react';
import * as helpers from "../utils/helperFunctions.js";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'

function ManageTimetable(props){
    const [filteredTimetable, setFilteredData] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const [activeView, setView] = useState(['HN1.23', 'HN1.24', 'N109', 'N111', 'N112', 'N113', 'N114', 'N115/6'])

    const initData = async (t) => {
        setTimetable(t)
        filterData(t);
        
    }

    const filterData = async (t) => {
        const filteredData = t.filter((tut) => activeView.includes(tut.location))
        setFilteredData(filteredData)
    }

    const toggleView = (room) => {
        var viewable = activeView;
        if(viewable.includes(room)){
            const rem = viewable.indexOf(room);
            viewable.splice(rem, 1)
        }else{
            viewable.push(room)
        }
        setView(viewable)
        filterData(timetable);
    }

    const fetchPost = async () => {
        initData(await helpers.getRoomTimetables());

    }

    useEffect(() => {fetchPost();}, [])

    return(
        <div className='manageTimetable'>
            <NavBar navigate={props.navigate} tab={'manage-data'}></NavBar>
            <div className='timetable-calendar'>
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
                        HN123: {text: 'HN1.23', click: function() { toggleView("HN1.23") }},
                        HN124: {text: 'HN1.24', click: function() { toggleView("HN1.24") }},
                        N109: {text: 'N109', click: function() { toggleView("N109") }},
                        N111: {text: 'N111', click: function() { toggleView("N111") }},
                        N112: {text: 'N112', click: function() { toggleView("N112") }},
                        N113: {text: 'N113', click: function() { toggleView("N113") }},
                        N114: {text: 'N114', click: function() { toggleView("N114") }},
                        N1156: {text: 'N115/6', click: function() { toggleView("N115/6") }},
                    }}
                headerToolbar={{
                    start: '', // will normally be on the left. if RTL, will be on the right
                    center: 'HN123 HN124 N109 N111 N112 N113 N114 N1156',
                    end: '' // will normally be on the right. if RTL, will be on the left
                }}
                events={filteredTimetable}
                />
            </div>

        </div>
    );
}
export default ManageTimetable;

