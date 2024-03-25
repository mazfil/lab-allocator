import './App.css';
import {useState} from 'react';
import {createContext, useContext} from 'react';
/*import logo from './ANU_Primary_Horizontal_GoldBlack.svg';*/





function App() {
  const Components = ({
    dashboard: [Dashboard, true],
    managedata: [ManageData, false],
    managetimetable: [ManageTimetable, false],
    uploaddata: [UploadData, false],
    about: [About, false],
    helpsupport: [HelpSupport, false],
    status: [Status, false]
  });

  const Display = Components.dashboard[0];
  

  return (

      <div className="App"> 
        <Display 
          Components
        />
      </div>

  );
}

export default App;

function Dashboard({Components}){
  return(
  <div className='dashboard'>
      <div className='main-logo'>
      {/*
        <img src={logo} alt='ANU Logo with Gold Crest and the words Australian National University '></img>
        REMOVE PLACEHOLDER UPON LOGO APPROVAL FROM BRANDING
      */}
        <div className='LOGO-PLACEHOLDER'>
          <h1>LOGO PENDING APPROVAL</h1>
        </div>
        <h1>SoCo Lab Allocation System</h1>
      </div>
      <div className='line-break'>
      </div>
      <div className='controls'>
        <div className='main-controls'>
          <div className='data-mgmt'>
            <div id='upload-data'>
              <button type="button">Upload Data</button>
            </div>
            <div>
              <button type="button">Manage Data</button>
            </div>
          </div>
          <div className='timetable-mgmt'>
            <button type="button">Manage Timetable</button> 
          </div>
        </div>
        <div className='control-gap'></div>
        <div className='app-mgmt'>
          <button type="button">About</button>
          <button type="button" id='help-supp' >Help & Support</button>
          <button type="button">Status</button>
        </div>
      </div>
    </div>

  )
}

function UploadData(){
  return(
    {/* HTML */}
  )
}

function ManageData(){
  return(
    {/* HTML */}
  )
}

function ManageTimetable(){
  return(
    {/* HTML */}
  )
}

function About(){
  return(
    {/* HTML */}
  )
}

function HelpSupport(){
  return(
    {/* HTML */}
  )
}

function Status(){
  return(
    {/* HTML */}
  )
}


