import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
  
const Home = () => {
    const [challenges, setChallenges] = useState<{ id: number; entryNames: string }[]>([]);

    useEffect(() => {
        fetchChallenges();
    }, []);

    let navigate = useNavigate();
    const viewChallengeButton = () => {
        let path = '../viewChallenge';
        navigate(path);
    }


    const fetchChallenges = async () => {
        try {
            const response = await axios.get("/server/challenges");
            if (Array.isArray(response.data)) {
                setChallenges(response.data);
            } else {
                console.error("Invalid response data format:", response.data);
            }
        } 
        catch (error) {
            console.error("Error fetching challenges:", error);
        }
    };

    return (
        <div className="home">
            <h1>Home Page</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {challenges.map((challenge) => (
                <div key={challenge.id}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ marginRight: 10 }}>{challenge.entryNames}</span>
                    <button onClick={viewChallengeButton}>View Challenge</button>
                </div>
                </div>
            ))}
            </div>
        </div>
    );  
};

export default Home;

