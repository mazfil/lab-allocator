import react, {Component} from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default class Dashboard extends Component{
    constructor(props){
        super(props)
    }

    

    render(){
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
}

