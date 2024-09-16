import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ManageData from './pages/ManageData';
import ManageTimetable from './pages/ManageTimetable';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Support from './pages/Support';
import Login from './pages/Login'
import Logs from './pages/Logs'
import Wiki from './pages/Wiki'
//import UploadData from './overlays/UploadData';
//import Status from './overlays/Status';
import {database} from './firebase';



export const Router = () => {
    const navigate = useNavigate();
    
    return(
        <Routes>
            {/*<Route path='/' element={<Login />} />*/}
            <Route path='/' element={<Dashboard navigate={navigate} db={database}/>} />
            <Route path='/Dashboard' element={<Login navigate={navigate} />} />
            <Route path='/Manage-Data' element={<ManageData navigate={navigate} tab={'manage-data'} db={database}/>}/>
            <Route path='/Manage-Timetable' element={<ManageTimetable navigate={navigate} tab={'manage-timetable'}/>}/>
            <Route path='/About' element={<About />}/>
            <Route path='/Support' element={<Support />}/>
            <Route path='/Logs' element={<Logs />}/>
            <Route path='/Wiki' element={<Wiki />}/>
        </Routes>
    )
}
