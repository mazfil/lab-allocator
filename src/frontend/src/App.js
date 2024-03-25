import './App.css';
/*import logo from './ANU_Primary_Horizontal_GoldBlack.svg';*/

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <div className='body'>
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
    </div>
  );
}

export default App;
