import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";
import Button from '@mui/material/Button';
import { Box, Card, Typography } from "@mui/material";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

interface chObj {
    id: number,
    name: string,
}

const Home = () => {

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

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
            console.log(finishedList);
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
                            <Button onClick={() => viewChallengeButton(challenge.id)}>
                                <Card 
                                    sx={{
                                        width: 400,
                                        maxWidth: 400,
                                        height: 500,
                                        maxHeight: 500,
                                        borderRadius: 5,
                                        border: `1px ${colours.primary[500]} solid`,
                                        backgroundImage: `url(${challenge.imgURL})`,
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center center",
                                        boxShadow: `inset 0px 150px 60px -80px ${colours.primary[100]}, inset 0px -150px 60px -80px ${colours.primary[100]}`
                                    }}
                                > 
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:"space-between",
                                            margin: 3,
                                            top: 0,
                                        }}
                                    >
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                left: 0,
                                                bottom: 0,
                                                position: "relative",
                                                color: colours.primary[900],
                                                textTransform: 'none',
                                                fontWeight: 800
                                            }}
                                        >
                                            {challenge.category}
                                        </Typography>

                                        <Typography 
                                            variant="body2"
                                            sx={{
                                                right: 0,
                                                bottom: 0,
                                                position: "relative",
                                                color: colours.primary[900],
                                                textTransform: 'none',
                                                fontWeight: 500
                                            }}
                                        >
                                            {challenge.deadline?.toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            position: "absolute",
                                            justifyContent: "left",
                                            alignContent: "baseline",
                                            margin: 3,
                                            width: '300px',
                                            maxWidth: '300px',
                                            bottom: 0,
                                        }}
                                    >   
                                        <Box 
                                            sx={{
                                                overflow: "hidden", 
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            <Typography
                                                noWrap
                                                variant="h4"
                                                sx={{
                                                    left: 0,
                                                    color: colours.primary[900],
                                                    textTransform: 'none',
                                                    textAlign: "left",
                                                    fontWeight: 600
                                                }}
                                            >
                                                {challenge.name}
                                            </Typography>
                                        </Box>
                                        
                                        <Box 
                                            sx={{
                                                overflow: "hidden", 
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            <Typography 
                                                noWrap
                                                sx={{
                                                    left: 0,
                                                    color: colours.primary[900],
                                                    textTransform: 'none',
                                                    textAlign: "left",
                                                    fontSize: 12,
                                                    fontWeight: 300,
                                                }}
                                            >
                                                {challenge.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;

