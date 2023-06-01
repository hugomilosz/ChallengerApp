import React from "react";
import { useNavigate } from 'react-router-dom';

const UploadSubmission = () => {
    let navigate = useNavigate();
    return (
        <div className="uploadSubmission">
            <h1>Upload Submission</h1>
            <body>Needs form to upload image/text</body>

            {/* Needs to take you back to where you just came from */}
            <button onClick={() => navigate(-1)}>Upload</button>
        </div>
    )
}

export default UploadSubmission