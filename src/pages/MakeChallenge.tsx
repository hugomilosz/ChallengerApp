import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MakeChallenge = () => {
    let navigate = useNavigate();
    const postButton = () => {
        let path = '../viewChallenge';
        navigate(path);
    }

    const sendFiles = async () => {
        // var input: any = document.getElementById('fileInput');
    
        // const form = document.getElementById('form');
        const formData = new FormData()

        // FormData.set(myFiles.get)

        const response = await fetch('./server/createChallenge', {
            method: 'POST',
            body: formData
        })

        const json = await response.json()

        console.log(json)
    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        alert("Here");
        event.preventDefault();
        sendFiles();
    }

    return (
        <div className="makeChallenge">
            <h1>Make a Challenge</h1>
            <form onSubmit={handleSubmit} id="form">
                <input type="text" placeholder='Challenge Name' />
                <textarea name="Description" cols={40} rows={5} placeholder='Description'></textarea>

                {/* add initial inspiration (image/text) - this button links to UploadSubmission*/}
                <input type="file" id="myFiles" accept="image/jpg" multiple />
                <input type="submit" />
            </form>
        </div>
    )
}

export default MakeChallenge