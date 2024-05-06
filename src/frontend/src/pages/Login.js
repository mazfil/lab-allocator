import {Component} from 'react';

export default class Login extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <form>
                <label>
                    <p>Username:</p>
                    <input type='text'></input>
                </label>
                <label>
                    <p>Password:</p>
                    <input type='password'></input>
                </label>
                <div>
                    <button type='submit'>Login</button>
                </div>
            </form>
        )
    }
}
