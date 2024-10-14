import React, { useState } from 'react';
import './NavBar.css';
import { useEffect } from 'react';

function NavBar(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const navigate = (destination) => {
      if(window.confirm("Changes you made may not be saved.")){
        props.navigate(destination)
      }
    }

    return (
        <div className='navbar'>
            <div className='navbar-logo' onClick={() => {navigate('/')}}>
                <img src={process.env.PUBLIC_URL + '/ANU Crest Inversed Gold.svg'} alt="Logo" />
                <h2>SoCo Lab Allocator</h2>
            </div>
            <div className='navbar-tabs'>
                <button
                    className={(props.tab === 'dashboard') ? 'navbar-button-active' : 'navbar-button-inactive'}
                    onClick={() => navigate('/')}>
                    Dashboard
                </button>

                <button
                    className={(props.tab === 'manage-data') ? 'navbar-button-active' : 'navbar-button-inactive'}
                    onClick={() => navigate('/Manage-Data')}>
                    Manage Data
                </button>

                <button
                    className={(props.tab === 'manage-timetable') ? 'navbar-button-active' : 'navbar-button-inactive'}
                    onClick={() => navigate('/Manage-Timetable')}>
                    Manage Timetable
                </button>

                {/* Dropdown Button for Wiki and About */}
                <div className="dropdown">
                    <button
                        className={(props.tab === 'wiki' || props.tab === 'about') ? 'navbar-button-active' : 'navbar-button-inactive'}
                        onClick={toggleDropdown}>
                        Resources ▼
                    </button>

                    {dropdownOpen && (
                        <div className="dropdown-content">
                            <button
                                className={(props.tab === 'wiki') ? 'navbar-button-active' : 'navbar-button-inactive'}
                                onClick={() => { navigate('/Wiki'); setDropdownOpen(false); }}>
                                Wiki
                            </button>

                            <button
                                className={(props.tab === 'about') ? 'navbar-button-active' : 'navbar-button-inactive'}
                                onClick={() => { navigate('/About'); setDropdownOpen(false); }}>
                                About
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NavBar;
