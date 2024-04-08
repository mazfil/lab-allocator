import {Component} from 'react';
import NavBar from '../components/nav/NavBar';

export default class ManageTimetable extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <NavBar navigate={this.props.navigate} tab={'manage-timetable'}></NavBar>
            // TODO: Code for Timetable Management Page
        )
    }
}

