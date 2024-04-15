import {useState} from 'react';
import * as helpers from "../utils/helperFunctions.js";

function Dashboard(props){
  const [dropBoxVisibility, setVisibility] = useState(false);

  const toggleDropBox = () => {
    console.log("toggles")
    setVisibility(!dropBoxVisibility);
  }

  const handleFile = () => {
    setVisibility(!dropBoxVisibility);
    helpers.readFileData(document.getElementById("df").files[0]);
  }

  return(
    <div className='dashboard'>
      {dropBoxVisibility ? 
        <div>
          <input type="file" id="df" accept='.csv' webkitdirectory></input>
          <button onClick={handleFile}>upload</button>
          
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
            <button type="button" onClick={() =>this.props.navigate('About')}>About</button>
            <button type="button" id='help-supp' onClick={() =>this.props.navigate('Support')}>Help & Support</button>
            <button type="button">Status</button>
          </div>
        </div> 
        
        
    </div>
  
  )
}
export default Dashboard;
/*

onClick={this.toggleDropBox()}



export default class Dashboard extends Component{
    constructor(props){
        super(props);
        this.inputRef = createRef();
    }
    

    toggleDropBox = () => {
      this.inputRef.current.display = 'block';
    }

    render(){


        
        return(
            <div className='dashboard'>
              <div ref={this.inputRef} className='file-drop-box'/>
                  <UploadData />
              <div/>
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
                        <button type="button" onClick={this.toggleDropBox()}>Upload Data</button>
                      </div>
                      <div>
                        <button type="button" onClick={() =>this.props.navigate('Manage-Data')}>Manage Data</button>
                      </div>
                    </div>
                    <div className='timetable-mgmt'>
                      <button type="button" onClick={() =>this.props.navigate('Manage-Timetable')}>Manage Timetable</button> 
                    </div>
                  </div>
                  <div className='control-gap'></div>
                  <div className='app-mgmt'>
                    <button type="button" onClick={() =>this.props.navigate('About')}>About</button>
                    <button type="button" id='help-supp' onClick={() =>this.props.navigate('Support')}>Help & Support</button>
                    <button type="button">Status</button>
                  </div>
                </div> 
                
                
            </div>
          
        )
    }
}*/

