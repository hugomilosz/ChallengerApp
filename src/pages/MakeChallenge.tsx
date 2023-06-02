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
        if (response.status === 200) {
            alert("Challenge created!");
        } else {
            alert("Error creating challenge!");
        }
    }

    return (
        <div className="makeChallenge" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Make a Challenge</h1>
            <form onSubmit={handleSubmit} id="form" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input type="text" placeholder='Challenge Name' style={{ marginBottom: 10 }} name="chName" />
                <textarea cols={40} rows={5} placeholder='Description' style={{ marginBottom: 10 }} name="chDesc"></textarea>
                <input type="file" id="myFiles" accept="image/jpg" multiple style={{ marginBottom: 10 }} name="insFile" />
                <input type="submit" style={{ marginBottom: 10 }} />
            </form>
        </div >
    )
}

export default MakeChallenge;
