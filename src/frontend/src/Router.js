import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ManageData from './pages/ManageData';
import ManageTimetable from './pages/ManageTimetable';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Support from './pages/Support';
import Login from './pages/Login'
//import UploadData from './overlays/UploadData';
//import Status from './overlays/Status';
import {database} from './firebase';



export const Router = () => {
    const navigate = useNavigate();
    
    return( null
        /*
        <Routes>
            <Route path='/' element={<Dashboard navigate={navigate} db={database}/>} />
            <Route path='/Login' element={<Login navigate={navigate} />} />
            <Route path='/Manage-Data' element={<ManageData navigate={navigate} tab={'manage-data'} db={database}/>}/>
            <Route path='/Manage-Timetable' element={<ManageTimetable navigate={navigate} tab={'manage-timetable'}/>}/>
            <Route path='/About' element={<About />}/>
            <Route path='/Support' element={<Support />}/>
       </Routes>*/
    )
}
