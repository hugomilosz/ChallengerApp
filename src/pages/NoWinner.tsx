import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { tokens } from "../theme";

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

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    return (
        <div className="noWinner" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 20 }}>
        {state?.id ? (
            <>
                   <Box 
                        component="img"
                        alt="Example"
                        src={challengeInfo.imgURL}
                        sx={{
                        height: "auto",
                        width: 500,
                        maxWidth: 500,
                        borderRadius: 3,
                        marginTop: 5
                        }}
                    />

                    <Box
                        sx={{
                        width: 500,
                        maxWidth: 500,
                        alignItems: "center",
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
                            variant="h5"
                            sx={{
                                left: 0,
                                bottom: 0,
                                position: "relative",
                                color: colours.yellow[500],
                                textTransform: 'none',
                                fontWeight: 500
                            }}
                        >
                            {challengeInfo.category}
                        </Typography>
                        <Typography 
                            variant="h6"
                            sx={{
                                right: 0,
                                bottom: 0,
                                position: "relative",
                                color: colours.redAcc[500],
                                textTransform: 'none',
                                fontWeight: 500
                            }}
                        >
                            {challengeInfo.deadline?.toLocaleString()}
                        </Typography>
                    </Box>

                    <Typography 
                        variant="h3"
                        sx={{
                        position: "relative",
                        left: 0,
                        color: colours.primary[900],
                        textTransform: 'none',
                        textAlign: "left",
                        fontWeight: 800,
                        marginLeft: 3,
                        marginRight:3,
                        marginBottom: 1,
                        }}
                    >
                        {challengeInfo.name}
                    </Typography>

                    <Typography 
                        variant="h5"
                        sx={{
                        position: "relative",
                        left: 0,
                        color: colours.primary[900],
                        textTransform: 'none',
                        textAlign: "left",
                        marginLeft: 3,
                        marginRight:3,
                        }}
                    >
                        {challengeInfo.description}
                    </Typography>

                    </Box>

                    <h2 style={{color: colours.redAcc[500]}}>This challenge had no submissions</h2>
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