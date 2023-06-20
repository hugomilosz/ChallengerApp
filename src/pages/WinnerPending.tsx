import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { tokens } from "../theme";
import { Box, Typography, useTheme } from "@mui/material";

const WinnerPending = () => {

    const navigate = useNavigate();

    const [challengeInfo, setChallenge] = useState<{ name: string, description: string, imgURL: string, entryNamesUrls: Array<{ entryName: string, url: string, likeCount: number, hahaCount: number, smileCount: number, wowCount: number, sadCount: number, angryCount: number }>, deadline: Date | null, category: string }>
        ({ name: "none", description: "none", imgURL: "", entryNamesUrls: [], deadline: null, category: "" });

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
                category: chs.subject,
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
        <div className="winnerPending" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 20, }}>
            {state?.id ? (
                <>
                    <h1 style={{ color: "#FF0000" }}>Winner Announcement Pending</h1>
                    <body style={{ color: "#FF0000" }}>Challenge ended at: {challengeInfo.deadline?.toLocaleTimeString()} on {challengeInfo.deadline?.toDateString()}</body>

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
                                justifyContent: "space-between",
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
                                marginRight: 3,
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
                                marginRight: 3,
                            }}
                        >
                            {challengeInfo.description}
                        </Typography>

                    </Box>

                    <Typography
                        variant="h2"
                        sx={{
                            position: "relative",
                            left: 0,
                            color: colours.primary[900],
                            textTransform: 'none',
                            textAlign: "left",
                            fontWeight: 800,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 5,
                        }}
                    >
                        Submissions:
                    </Typography>
                    {challengeInfo.entryNamesUrls.map((entry) => (
                        <body>
                            <Box
                                component="img"
                                alt="Submission"
                                src={entry.url}
                                sx={{
                                    height: "auto",
                                    width: 400,
                                    maxWidth: 400,
                                    borderRadius: 3,
                                    marginTop: 3
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                <div style={{ marginRight: '10px' }}>
                                    <h3>{entry.likeCount}❤️</h3>
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <h3>{entry.hahaCount}😂</h3>
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <h3>{entry.smileCount}😃</h3>
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <h3>{entry.wowCount}😯</h3>
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <h3>{entry.sadCount}😢</h3>
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <h3>{entry.angryCount}🤩</h3>
                                </div>
                            </div>
                        </body>
                    ))}
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

export default WinnerPending
