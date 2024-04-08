import {Component, useState} from 'react';
import NavBar from '../components/nav/NavBar';

export default class ManageData extends Component{
    constructor(props){
        super(props)
    }
    
    render(){
        return(
            <NavBar navigate={this.props.navigate} tab={'manage-data'}></NavBar>
            // TODO: Code for Data Management Page
        )
    }
}
