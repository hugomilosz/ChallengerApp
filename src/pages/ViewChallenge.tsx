import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const ViewChallenge = () => {
    const [challengeInfo, setChallenge] = useState<any>({ name: "none", description: "none", imgURL: "", entryNames: "" });

    useEffect(() => {
        fetchInfo();
    }, []);

    const { state } = useLocation();

    const fetchInfo = async () => {
        const responseDBInfo = await fetch(`/server/challenge/${state.id}`);
        const body = await responseDBInfo.text();
        const chs = JSON.parse(body);
        setChallenge({
            name: chs.name,
            description: chs.description,
            imgURL: await (await fetch(`/uploadsURL/${chs.topic}`)).text(),
            entryNames: chs.entryNames
        });
    };

    const handleSubmitSubmission = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            file: { files: FileList }
        };

        const formData = new FormData();
        formData.append("chId", state.id);
        formData.append("file", target.file.files[0], target.file.files[0].name);

        const response = await fetch('./server/uploadImg', {
            method: 'POST',
            body: formData,
        })
        if (response.status === 200) {
            alert("It worked!");
        } else {
            alert("Error creating submission!");
        }
    }

    return (
        <div className="viewChallenge">
            <h1>View Challenge {state.id}</h1>
            <h2>Name</h2>
            <body>{challengeInfo.name}</body>

            <h2>Description</h2>
            <body>{challengeInfo.description}</body>

            <h2>Initial Inspiration</h2>
            <body><img src={challengeInfo.imgURL} className="insImage" /></body>

            <form onSubmit={handleSubmitSubmission} id="form" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input type="file" id="myFiles" accept="image/jpg" multiple style={{ marginBottom: 10 }} name="file" />
                <input type="submit" style={{ marginBottom: 10 }} />
            </form>

            <h1>Existing Submissions!</h1>

        </div>
    )
}

export default ViewChallenge