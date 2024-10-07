import "./Alert.css"

import 'bootstrap-icons/font/bootstrap-icons.css';


function Alert(props){
  
  return(
    <div className="alert" style={{backgroundColor: props.status.type === "Success" ? "#c9fec0" : "#fec9c0"}}>
    {props.status.visibility ?
      <div className="alert-content">
        {props.status.type === "Success" ?
        <i class="bi bi-check-circle alert-status"></i>
        :
        <i class="bi bi-x-circle alert-status"></i>
        }
        <p><b>{props.status.type}</b>: {props.status.message}</p>
        <button className="close-alert" onClick={props.status.toggle}><i class="bi bi-x-square-fill"></i></button>
      </div>
      :
      null
    }
      
    </div>
  );

}
export default Alert;