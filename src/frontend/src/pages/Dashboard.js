import {useState} from 'react';
import * as helpers from "../utils/helperFunctions.js";
import './styles/Dashboard.css';

function Dashboard(props){
  const [dropBoxVisibility, setVisibility] = useState(false);

  // Hides or Shows the drop box data input.
  const toggleDropBox = () => {
    setVisibility(!dropBoxVisibility);
  }

  // Prevents the upload data panel from closing when clicking 
  const stopDBClose = (event) => {
    event.stopPropagation();
  }

  //Takes file input and sends to helper functions, uploads course data.
  const handleFile = async () => {
    await helpers.readFileData(document.getElementById("df").files[0])
    toggleDropBox();
  }

  const startBackend = async () => {
    await fetch("http://laballoc-dev.cecs.anu.edu.au:8080/start", {method: "GET"})
  }



  return(
    <div className='dashboard'>
      {dropBoxVisibility ? 
        <div className='file-drop-box-overlay' onClick={toggleDropBox}>
          <div className='file-drop-box' onClick={stopDBClose}>
            <div className='file-input'>
              <input type="file" id="df" accept='.csv'></input>
              <a className='template-link' href={process.env.PUBLIC_URL + '/Course_Data_Excel_Template.xlsx'} ><p>Download Excel Template File Here</p></a>
              <button onClick={handleFile}>Upload</button>
            </div>
          </div>
        </div>
        : null
        }
        <div className='main-logo'>
             <img src={process.env.PUBLIC_URL + '/ANU Primary Horizontal GoldBlack.svg'} alt='ANU Logo with Gold Crest and the words Australian National University ' />
          <h1>SoCo Lab Allocation System</h1>
        </div>
        <div className='line-break'>
        </div>
        <div className='controls'>
          <div className='main-controls'>
            <div className='data-mgmt'>
              <div id='upload-data'>
                <button type="button" onClick={toggleDropBox}>Upload Data</button>
              </div>
              <div>
                <button type="button" onClick={() =>props.navigate('Manage-Data')}>Manage Data</button>
              </div>
            </div>
            <div className='timetable-mgmt'>
              <button type="button" onClick={() =>props.navigate('Manage-Timetable')}>Manage Timetable</button> 
            </div>
          </div>
          <div className='control-gap'></div>
          <div className='app-mgmt'>
            <button type="button" onClick={() =>props.navigate('About')}>About</button>
            <button type="button" id='help-supp' onClick={() =>props.navigate('Wiki')}>Help</button>
            <button type="button" onClick={() =>props.navigate('Logs')}>Logs</button>
            <button type="button" onClick={() => startBackend}>Generate</button>
          </div>
        </div> 
        
        
        
    </div>
  
  )
}
export default Dashboard;
