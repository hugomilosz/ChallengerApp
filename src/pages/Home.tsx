import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";
import Button from '@mui/material/Button';
import { Box } from "@mui/material";
// import { tokens } from "../theme";
// import { useTheme } from "@mui/material";

interface chObj {
    id: number,
    name: string,
}

interface chInfoObj {
    id: number,
    name: string,
    description: string,
    imgURL: string,
    deadline: Date | null,
    category: string
}

const Home = () => {

    // const theme = useTheme();
    // const colours = tokens(theme.palette.mode);

    const [challenges, setChallenges] = useState<{ id: number, name: string, description: string, imgURL: string, deadline: Date | null, category: string }[]>([]);

    let navigate = useNavigate();
    const viewChallengeButton = (id: Number) => {
        let path = '../viewChallenge';
        navigate(path, { state: { id: id } });
    }

    const fetchChallenges = async () => {
        try {
            const response = await fetch("/server/challenges");
            const chList: chObj[] = JSON.parse(await response.text());

            const chInfoList = chList.map(async ch => {
                const responseDBInfo = await fetch(`/server/challenge/${ch.id}`);
                const body = await responseDBInfo.text();
                const chInfo = JSON.parse(body);
                const deadlineDate = new Date(chInfo.date);

                return ({
                    id: ch.id,
                    name: chInfo.name as string,
                    description: chInfo.description as string,
                    imgURL: await (await fetch(`/uploadsURL/${chInfo.topic}`)).text(),
                    deadline: deadlineDate,
                    category: (await (await fetch(`/category/${ch.id}`)).json()).subject,
                })
            })

            const finishedList = await Promise.all(chInfoList)

            if (Array.isArray(finishedList)) {
                setChallenges(finishedList);
            } else {
                console.error("Invalid response data format:", response.body);
            }
        }
        catch (error) {
            console.error("Error fetching challenges:", error);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);
    
    // Filter out challenges with a name of null
    const filteredChallenges = challenges.filter(challenge => challenge.name !== null         
                                                           || challenge.description !== null  
                                                           || challenge.category !== null     
                                                           || challenge.deadline !== null     
                                                           || challenge.imgURL !== null
                                                );

    return (
        <div className="home">
            <SearchBar />
            <h1>Home Page</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {filteredChallenges.map((challenge) => (
                    <div key={challenge.id}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                            <span style={{ marginRight: 10 }}>{challenge.name}</span>
                            <button onClick={() => viewChallengeButton(challenge.id)}>
                                Button
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;

