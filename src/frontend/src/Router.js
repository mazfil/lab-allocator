import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ManageData from './pages/ManageData';
import ManageTimetable from './pages/ManageTimetable';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Support from './pages/Support';
//import Login from './pages/Login'
//import UploadData from './overlays/UploadData';
//import Status from './overlays/Status';

export const Router = () => {
    const navigate = useNavigate();
    
    return(
        <Routes>
            {/*<Route path='/' element={<Login />} />*/}
            <Route path='/' element={<Dashboard navigate={navigate}/>} />
            <Route path='/Manage-Data' element={<ManageData />}/>
            <Route path='/Manage-Timetable' element={<ManageTimetable />}/>
            <Route path='/About' element={<About />}/>
            <Route path='/Support' element={<Support />}/>
        </Routes>
    )
}
