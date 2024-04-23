import {Component} from 'react';
import NavBar from '../components/nav/NavBar';
import { useState } from 'react';
import {collection, getDocs, get} from 'firebase/firestore'
import { useEffect } from 'react';
import * as helpers from "../utils/helperFunctions.js";

function ManageTimetable(props){
    const [timetable_data, setTimetableData] = useState([]);
    const [tutorials, setTutData] = useState([]);


    const fetchPost = async () => {
        const timetables = await helpers.getData("timetable");
        setTimetableData(timetables)
        const tutorials = await helpers.getData("timetable/"+timetables[0].id+"/tutorials");
        setTutData(tutorials)
    }


    useEffect(() => {fetchPost();}, [])
    console.log(tutorials)


    return(
        null
    );
}
export default ManageTimetable;

