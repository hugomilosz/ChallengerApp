import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const ViewChallenge = () => {
    const [challengeInfo, setChallenge] = useState<any>({ name: "none", description: "none", imgURL: "" });

    useEffect(() => {
        fetchInfo();
    }, []);

    let navigate = useNavigate();
    const routeChange = () => {
        let path = '../uploadSubmission';
        navigate(path);
    }

    const { state } = useLocation();

    const fetchInfo = async () => {
        const responseDBInfo = await fetch(`/server/challenge/${state.id}`);
        const body = await responseDBInfo.text();
        const chs = JSON.parse(body);
        setChallenge({ name: chs.name, description: chs.description, imgURL: await (await fetch(`/uploadsURL/${chs.topic}`)).text() });
    };

    return (
        <div className="viewChallenge">
            <h1>View Challenge {state.id}</h1>
            <form>
                <h2>Name</h2>
                <body>{challengeInfo.name}</body>

                <h2>Description</h2>
                <body>{challengeInfo.description}</body>

                <h2>Initial Inspiration</h2>
                <body><img src={challengeInfo.imgURL} /></body>

                {/* add actual submission (image/text) */}
                <button onClick={routeChange}> Upload Submission </button>
            </form>
        </div>
    )
}

export default ViewChallenge