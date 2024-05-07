import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard"
import ManageTimetable from './pages/ManageTimetable';
import ManageData from './pages/ManageData';
import Support from './pages/Support';
import About from './pages/About';
const App = () => {

  return (
    <div className='App'> 
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="Dashboard/Manage-Timetable"
          element={
            <ProtectedRoute>
              <ManageTimetable />
            </ProtectedRoute>
          }
        />
        <Route
          path="Dashboard/Manage-Data"
          element={
            <ProtectedRoute>
              <ManageData />
            </ProtectedRoute>
          }
        />
        <Route
          path="Dashboard/About"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="Dashboard/Support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </div>
  );
}
export default App;
  


  






