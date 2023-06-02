import React from 'react';

const MakeChallenge = () => {
    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            chName: { value: string },
            chDesc: { value: string },
            insFile: { files: FileList }
        };

        const formData = new FormData();
        formData.append("name", target.chName.value);
        formData.append("desc", target.chDesc.value);
        formData.append("file", target.insFile.files[0], target.insFile.files[0].name);

        const response = await fetch('./server/createChallenge', {
            method: 'POST',
            body: formData,
        })
    }

    return (
        <div className="makeChallenge">
            <h1>Make a Challenge</h1>
            <form onSubmit={handleSubmit} id="form">
                <input type="text" placeholder='Challenge Name' name="chName" />
                <textarea cols={40} rows={5} placeholder='Description' name="chDesc"></textarea>

                {/* add initial inspiration (image/text) - this button links to UploadSubmission*/}
                <input type="file" id="myFiles" accept="image/jpg" name="insFile" />
                <input type="submit" />
            </form>
        </div>
    )
}

export default MakeChallenge;
