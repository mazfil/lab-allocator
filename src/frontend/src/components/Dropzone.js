import React from "react";
import Dropzone, {useDropzone} from "react-dropzone";{}

function Dropzone({}) {
    const {getRootProps, getInputProps} = useDropzone({});
    return (
        <div {...getRootProps({ className: "dropzone" })}>
          <input className="input-zone" {...getInputProps()} />
          <div className="text-center">
            <p className="dropzone-content">
              Drag’n’drop some files here, or click to select files
            </p>
            )
          </div>
        </div>
      );
}

export default Dropzone;
