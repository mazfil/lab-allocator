import {Component} from 'react';

export default class NavBar extends Component{
    constructor(props){
        super(props)
    }
    
    render(){
        return(
            <div className='navbar'>
                <div className='navbar-logo'>
                    <img src={process.env.PUBLIC_URL + '/ANU Crest Inversed Gold.svg'} onClick={() => this.props.navigate('/')}/>
                    <h2>SoCo Lab Allocator</h2>
                </div>
                <div className='navbar-tabs'>
                    <button 
                    className={(this.props.tab=='dashboard')?'navbar-button-active':'navbar-button-inactive'} 
                    onClick={() =>this.props.navigate('/')}>
                        Dashboard
                    </button>

                    <button 
                    className={(this.props.tab=='manage-data')?'navbar-button-active':'navbar-button-inactive'} 
                    onClick={() =>this.props.navigate('/Manage-Data')}>
                        Manage Data
                    </button>

                    <button 
                    className={(this.props.tab=='manage-timetable')?'navbar-button-active':'navbar-button-inactive'} 
                    onClick={() =>this.props.navigate('/Manage-Timetable')}>
                        Manage Timetable
                    </button>
                </div>
            </div>
        )
    }
}