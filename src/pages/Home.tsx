import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const Home = () => {
    const [challenges, setChallenges] = useState<{ id: number; name: string }[]>([]);

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    useEffect(() => {
        fetchChallenges();
    }, []);

    let navigate = useNavigate();
    const viewChallengeButton = (id: Number) => {
        let path = '../viewChallenge';
        navigate(path, { state: { id: id } });
    }


    const fetchChallenges = async () => {
        try {
            const response = await fetch("/server/challenges");
            const chs = JSON.parse(await response.text());
            if (Array.isArray(chs)) {
                setChallenges(chs);
            } else {
                console.error("Invalid response data format:", response.body);
            }
        }
        catch (error) {
            console.error("Error fetching challenges:", error);
        }
    };

    // Filter out challenges with a name of null
    const filteredChallenges = challenges.filter(challenge => challenge.name !== null);

    return (
        <div className="home">
            <SearchBar />
            <h1>Home Page</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {filteredChallenges.map((challenge) => (
                    <div key={challenge.id}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                            <span style={{ marginRight: 10 }}>{challenge.name}</span>
                            <button onClick={() => viewChallengeButton(challenge.id)}>View Challenge</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;

