import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { tokens } from "../theme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers-pro';

const NoSubmissions = () => {

    const navigate = useNavigate();

    const [challengeInfo, setChallenge] = useState<{ name: string, description: string, imgURL: string, entryNamesUrls: Array<{ entryName: string, url: string, likeCount: number, hahaCount: number, smileCount: number, wowCount: number, sadCount: number, angryCount: number }>, deadline: Date | null, category: string }>
        ({ name: "none", description: "none", imgURL: "", entryNamesUrls: [], deadline: null, category: ""});

    const { state } = useLocation();

    async function getReactionCount(entryWithoutPrefix: string, reactionName: string) {
        const reactionCountResponse = await fetch(`/viewReactions/${entryWithoutPrefix}/${reactionName}`);
        const reactionCountData = await reactionCountResponse.json();
        switch (reactionName) {
            case "likeCount": return reactionCountData.length > 0 ? reactionCountData[0].likeCount : 0;
            case "hahaCount": return reactionCountData.length > 0 ? reactionCountData[0].hahaCount : 0;
            case "smileCount": return reactionCountData.length > 0 ? reactionCountData[0].smileCount : 0;
            case "wowCount": return reactionCountData.length > 0 ? reactionCountData[0].wowCount : 0;
            case "sadCount": return reactionCountData.length > 0 ? reactionCountData[0].sadCount : 0;
            case "angryCount": return reactionCountData.length > 0 ? reactionCountData[0].angryCount : 0;
            default: console.error("not a valid reaction"); break;
        }
        const reactionCount = reactionCountData.length > 0 ? reactionCountData[0].likeCount : 0;
        return reactionCount;
    }

  useEffect(() => {
        const fetchInfo = async () => {
            const responseDBInfo = await fetch(`/server/challenge/${state.id}`);
            const body = await responseDBInfo.text();
            const chs = JSON.parse(body);
            const splitArray = chs.entryNames === "" ? [] : (chs.entryNames as String).split(",")
            const deadlineDate = new Date(chs.date);
            setDeadlineDate(deadlineDate);
            const urls = splitArray.map(async (entryName: string) => {

                const url = (await (await fetch(`/uploadsURL/${entryName}`)).text());

                const likeCount = await getReactionCount(entryName, "likeCount");
                const hahaCount = await getReactionCount(entryName, "hahaCount");
                const smileCount = await getReactionCount(entryName, "smileCount");
                const wowCount = await getReactionCount(entryName, "wowCount");
                const sadCount = await getReactionCount(entryName, "sadCount");
                const angryCount = await getReactionCount(entryName, "angryCount");

                return { entryName, url, likeCount, hahaCount, smileCount, wowCount, sadCount, angryCount };
            });
            setChallenge({
                name: chs.name as string,
                description: chs.description as string,
                imgURL: await (await fetch(`/uploadsURL/${chs.topic}`)).text(),
                entryNamesUrls: await Promise.all(urls),
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

    const extendDeadline = async (date: string) => {
        date = date.replace("T", " ");
        console.log("New deadline: ", date);
        const response = await fetch(`./extendDeadline/${state.id}/${date}`, {
            method: 'POST'
        })
        if (response.status === 200) {
            alert("Deadline successfully extended!");
            let path = '../viewChallenge';
            navigate(path, { state: { id: state.id } });
            // naviagte to view challenge if successful
        } else {
            alert("Error extending the deadline!");
        }
    }

    const deleteChallenge = async () => {
        const response = await fetch(`./deleteChallenge/${state.id}`, {
            method: 'POST'
        })
        if (response.status === 200) {
            alert("Challenge successfully deleted!");
            navigateToHomeScreen();
            // naviagte to view challenge if successful
        } else {
            alert("Error deleting the challenge!");
        }
    }

    const archiveChallenge = async () => {
        await fetch(`./setArchived/${state.id}`, {
            method: 'POST'
        });

        alert("Challenge archived!");
        let path = '../noWinner';
        navigate(path, { state: { id: state.id } });
    }

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    return (
        <div className="noSubmissions" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 20 }}>
            {state?.id ? (
                <>
                    <Typography 
                        variant="h2"
                        sx={{
                            color: colours.redAcc[500],
                            textTransform: 'none',
                            fontWeight: 800,
                            marginTop: 5,
                        }}
                    >
                        No Submissions
                    </Typography>

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

                    <h2 style={{color: colours.redAcc[500]}}>No submissions have been made to this challenge.</h2>
                    <h3 style={{color: colours.primary[900]}}>Choose an option below:</h3>
                    <div 
                        style={{ 
                            marginBottom: 20,
                            display: "flex"
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs} > 
                            <DateTimePicker
                                sx={{ paddingBottom:20, marginBottom: 30, marginRight: 5, width: 200, maxWidth: 200 }} 
                                label="Deadline" 
                                slotProps={{
                                    textField: {
                                        name: "chDate",
                                        required: true,
                                        id: "chDate",
                                        sx: { '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: colours.yellow[500],
                                                },
                                            },
                                            ' & label.Mui-focused': {
                                                color: colours.yellow[500]
                                            },
                                            width: 300,
                                            maxWidth: 300,
                                        }
                                    },
                                }}
                                format="YYYY-MM-DD HH:mm:ss"
                                disablePast
                            />
                        </LocalizationProvider>
                        <Button 
                            variant="contained"
                            color="secondary" 
                            onClick={() => extendDeadline((document.getElementById("chDate") as HTMLInputElement).value)}
                        >
                            Extend the Deadline
                        </Button>
                    </div>
                    <div>
                        <Button 
                            variant="contained"
                            color="error"
                            style={{ 
                                width: 300,
                                maxWidth: 300
                            }}
                            onClick={deleteChallenge}
                        >
                                Delete the Challenge
                        </Button>
                    </div>< br/>
                    <div>
                        <Button 
                            variant="contained"
                            color="success"
                            style={{ 
                                marginBottom: 5,
                                width: 300,
                                maxWidth: 300
                            }}
                            onClick={archiveChallenge}
                        >
                                Archive the Challenge
                        </Button>
                        <Box
                            sx={{
                                width: 500,
                                maxWidth: 500,
                            }}
                        >
                        <Typography
                            variant="h6"
                            sx={{
                            position: "relative",
                            left: 0,
                            color: colours.primary[700],
                            textTransform: 'none',
                            textAlign: "center",
                            marginLeft: 3,
                            marginRight:3,
                            marginTop: 3,
                            fontWeight: 400,
                            }}
                        >
                            Archiving a challenge means it will be accessible from the Home page and in Search results.
                            Along with the challenge information it will mention that no submissions were provided.
                        </Typography>
                        </Box>
                    </div>
                </>
            ) : (
                <>
                    <h1>Invalid Challenge ID</h1>
                    <button onClick={navigateToHomeScreen}>Click here to go back to the Home Screen</button>
                </>
            )}

        </div>
    )
}

export default NoSubmissions;