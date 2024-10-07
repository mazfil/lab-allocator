import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ManageData from './pages/ManageData';
import ManageTimetable from './pages/ManageTimetable';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import Logs from './pages/Logs';
import Wiki from './pages/Wiki';
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
            <Route path='/About' element={<About navigate={navigate} tab={'manage-timetable'}/>}/>
            <Route path='/Logs' element={<Logs />}/>
            <Route path='/Wiki' element={<Wiki navigate={navigate} tab={'wiki'}/>}/>
        </Routes>
    )
}
