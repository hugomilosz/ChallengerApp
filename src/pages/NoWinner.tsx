import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const NoWinner = () => {

    const [challengeInfo, setChallenge] = useState<{ 
                name: string, 
                description: string, 
                imgURL: string, 
                deadline: Date | null,
                category: string
            }>
        ({ name: "none", description: "none", imgURL: "", deadline: null, category: ""});

    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            const responseDBInfo = await fetch(`/server/challenge/${state.id}`);
            const body = await responseDBInfo.text();
            const chs = JSON.parse(body);
            const deadlineDate = new Date(chs.date);
            setDeadlineDate(deadlineDate);
    
            setChallenge({
                name: chs.name as string,
                description: chs.description as string,
                imgURL: await (await fetch(`/uploadsURL/${chs.topic}`)).text(),
                deadline: deadlineDate,
                category: (await (await fetch(`/category/${state.id}`)).json()).subject,
            });
        };
        fetchInfo();
    }, [state.id]);

    const [, setDeadlineDate] = useState<Date | null>(null);

    const navigateToHomeScreen = () => {
        navigate('/')
    }

    return (
        <div className="noWinner">
        {state?.id ? (
            <>
                    <h1>Challenge Prompt:</h1>
                    <h2>Name</h2>
                    <body>{challengeInfo.name}</body>

                    <h2>Category</h2>
                    <body>{challengeInfo.category}</body>

                    <h2>Description</h2>
                    <body>{challengeInfo.description}</body>

                    <h2 style={{color: "#FF0000"}}>Challenge ended at:</h2>
                    <body style={{color: "#FF0000"}}>{challengeInfo.deadline?.toLocaleTimeString()} on {challengeInfo.deadline?.toDateString()}</body>

                    <h2>Initial Inspiration</h2>
                    <body><img src={challengeInfo.imgURL} className="insImage" alt="" /></body>

                    <h2 style={{color: "#FF0000"}}>This challenge had no submissions</h2>
            </>
        ) : (
            <>
                <h1>Invalid Challenge ID</h1>
                <button onClick={navigateToHomeScreen}>Click here to go back to the Home Screen</button>
            </>
        )}

    </div>
    )
};

export default NoWinner;