import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { tokens } from "../theme";

const AnnounceWinner = () => {

    const [challengeInfo, setChallenge] = useState<{
        name: string,
        description: string,
        imgURL: string,
        entryNamesUrls: Array<{
            entryName: string,
            url: string,
            likeCount: number,
            hahaCount: number,
            smileCount: number,
            wowCount: number,
            sadCount: number,
            angryCount: number
        }>,
        winner: Array<{
            entryName: string,
            url: string,
            likeCount: number,
            hahaCount: number,
            smileCount: number,
            wowCount: number,
            sadCount: number,
            angryCount: number
        }>,
        runnersUp: Array<{
            entryName: string,
            url: string,
            likeCount: number,
            hahaCount: number,
            smileCount: number,
            wowCount: number,
            sadCount: number,
            angryCount: number
        }>,
        deadline: Date | null,
        category: string
    }>
        ({ name: "none", description: "none", imgURL: "", entryNamesUrls: [], winner: [], runnersUp: [], deadline: null, category: "" });

    const { state } = useLocation();
    const navigate = useNavigate();

    async function getReactionCounts(entryWithoutPrefix: string, reactionName: string) {
        const reactionCountResponse = await fetch(`/viewReactions/${entryWithoutPrefix}`);
        const reactionCountData = await reactionCountResponse.json();
        return {
            likeCount: reactionCountData.length > 0 ? reactionCountData[0].likeCount : 0,
            hahaCount: reactionCountData.length > 0 ? reactionCountData[0].hahaCount : 0,
            smileCount: reactionCountData.length > 0 ? reactionCountData[0].smileCount : 0,
            wowCount: reactionCountData.length > 0 ? reactionCountData[0].wowCount : 0,
            sadCount: reactionCountData.length > 0 ? reactionCountData[0].sadCount : 0,
            angryCount: reactionCountData.length > 0 ? reactionCountData[0].angryCount : 0,
        }
    }

    useEffect(() => {
        const fetchInfo = async () => {
            const responseDBInfo = await fetch(`/server/challenge/${state.id}`);
            const body = await responseDBInfo.text();
            const chs = JSON.parse(body);
            const splitArray = chs.entryNames === "" ? [] : (chs.entryNames as String).split(",");
            const deadlineDate = new Date(chs.date);
            setDeadlineDate(deadlineDate);

            const entries = splitArray.map(async (entryName: string) => {
                const url = await (await fetch(`/uploadsURL/${entryName}`)).text();
                const reactionCounts = await getReactionCounts(entryName, "likeCount");
                return { entryName, url, ...reactionCounts };
            });

            // Sort the entries based on the like count in descending order
            const sortedEntries = await Promise.all(entries);
            sortedEntries.sort((a, b) => b.likeCount - a.likeCount);

            const winningEntryDB = await (await fetch(`/getWinner/${state.id}`)).json();
            const winningEntryUrl = await (await fetch(`/uploadsURL/${winningEntryDB.filename}`)).text();

            setChallenge({
                name: chs.name as string,
                description: chs.description as string,
                imgURL: await (await fetch(`/uploadsURL/${chs.topic}`)).text(),
                entryNamesUrls: sortedEntries,
                winner: sortedEntries.filter(function (entry) {
                    return entry.url === winningEntryUrl;
                }),
                runnersUp: sortedEntries.filter(function (entry) {
                    return entry.url !== winningEntryUrl;
                }),
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

    console.log("winningEntryDB:", challengeInfo.winner);

    return (
        <div className="announceWinner" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 20 }}>
            {state?.id ? (
                <>
                    {challengeInfo.winner.length > 0 ? (
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
                                    color: colours.greenAcc[500],
                                    textTransform: 'none',
                                    textAlign: "left",
                                    fontWeight: 800,
                                    marginLeft: 3,
                                    marginRight: 3,
                                    marginTop: 5,
                                }}
                            >
                                Winner of challenge:
                            </Typography>

                            <body>
                                <Box
                                    component="img"
                                    alt="Winner"
                                    src={challengeInfo.winner[0].url}
                                    sx={{
                                        height: "auto",
                                        width: 400,
                                        maxWidth: 400,
                                        borderRadius: 3,
                                        marginTop: 3
                                    }}
                                />
                                <body>
                                    <div style={{ display: 'flex', justifyContent: "center" }}>
                                        <div style={{ marginRight: '10px' }}>
                                            <h3>{challengeInfo.winner[0].likeCount}❤️</h3>
                                        </div>
                                        <div style={{ marginRight: '10px' }}>
                                            <h3>{challengeInfo.winner[0].hahaCount}😂</h3>
                                        </div>
                                        <div style={{ marginRight: '10px' }}>
                                            <h3>{challengeInfo.winner[0].smileCount}😃</h3>
                                        </div>
                                        <div style={{ marginRight: '10px' }}>
                                            <h3>{challengeInfo.winner[0].wowCount}😯</h3>
                                        </div>
                                        <div style={{ marginRight: '10px' }}>
                                            <h3>{challengeInfo.winner[0].sadCount}😢</h3>
                                        </div>
                                        <div style={{ marginRight: '10px' }}>
                                            <h3>{challengeInfo.winner[0].angryCount}🤩</h3>
                                        </div>
                                    </div>
                                </body>
                            </body>
                            <hr />

                            <Typography
                                variant="h2"
                                sx={{
                                    position: "relative",
                                    left: 0,
                                    color: colours.yellow[500],
                                    textTransform: 'none',
                                    textAlign: "left",
                                    fontWeight: 800,
                                    marginLeft: 3,
                                    marginRight: 3,
                                    marginTop: 5,
                                }}
                            >
                                Runners-up:
                            </Typography>
                            <div>
                                {challengeInfo.runnersUp.map((entry, index) => (
                                    <div key={index}>
                                        <Box
                                            component="img"
                                            alt="insImage"
                                            src={entry.url}
                                            sx={{
                                                height: "auto",
                                                width: 400,
                                                maxWidth: 400,
                                                borderRadius: 3,
                                                marginTop: 3
                                            }}
                                        />
                                        <body>
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
                                    </div>

                                ))}
                            </div>
                        </>
                    ) : (
                        <h1>Loading...</h1>
                    )}
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

export default AnnounceWinner;