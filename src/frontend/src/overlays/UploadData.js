import {Component} from 'react';
import Dropzone, {useDropzone, FileWithPath} from 'react-dropzone';
import {useState} from 'react';

const UploadData = (props) => {
    const [fileVisibility, setFileVisibility] = useState(false)

    const toggleFile = () => {
        setFileVisibility(!fileVisibility);
    }

    
    const {getRootProps, getInputProps} = useDropzone({
        accept: {'text/csv': []},
        onDrop: acceptedFiles => {console.log(acceptedFiles.FileWithPath); props.handleFile(acceptedFiles);},
        // CALL API HERE
    });


    return (
        <div {...getRootProps()}  className='file-drop-box'>
            <input {...getInputProps()} />
            <h2 className='dropbox-title'>Drop .csv File, or Click to Browse</h2>

        </div>
    );
};

export default UploadData;

/* 
<ul>
                {acceptedFiles.map((file) =>(<li key={file.name}>{file.name}</li>))}
            </ul>
*/