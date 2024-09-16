import {useState} from 'react';
import { useEffect } from 'react';
import * as helpers from "../utils/helperFunctions.js";


function Logs(props){
  const [logs, setLogs] = useState([]);

  const fetchPost = async () => {
    setLogs(await helpers.queryLogs())
  }

  useEffect(() => {fetchPost();}, [])

  return(
    <div className='logs'>
        <table>
            <thead>
                <tr>
                    <th>Log Type</th>
                    <th>Message</th>
                    <th>Date</th>
                </tr>
                
            </thead>
            <tbody>
                {logs.map(log => {
                    return(
                        <tr key={log._id}>
                            <td>{log.type}</td>
                            <td>{log.message}</td>
                            <td>{(new Date(log.timestamp)).toString().substring(0, 24)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  
  )
}
export default Logs;
