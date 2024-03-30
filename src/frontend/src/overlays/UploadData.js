import {Component} from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';
import {useState} from 'react';

const UploadData = (props) => {
    const [fileVisibility, setFileVisibility] = useState(false)

    const toggleFile = () => {
        console.log("DIE")
        setFileVisibility(!fileVisibility);
    }

    
    const {getRootProps, getInputProps, acceptedFiles} = useDropzone({
        accept: {'text/csv': []}
        // CALL API HERE
    });


    return (
        <div {...getRootProps()}  className='file-drop-box'>
            <input {...getInputProps()} />
            <h2>Drop .csv File, or Click to Browse</h2>
            {acceptedFiles[0] != null ?          
                    <div className='submitted-files'>
                        <h1 class="bi bi-filetype-csv"></h1>
                        {acceptedFiles.map((file) =>(<h3 key={file.name}>{file.name}</h3>))}
                    </div>
                : null
            }
        </div>
    );
};

export default UploadData;

/* 
<ul>
                {acceptedFiles.map((file) =>(<li key={file.name}>{file.name}</li>))}
            </ul>
*/