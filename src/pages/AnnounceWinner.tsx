import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const AnnounceWinner = () => {

    const [challengeInfo, setChallenge] = useState<{ name: string, description: string, imgURL: string, entryNamesUrls: Array<{ entryName: string, url: string, likeCount: number, hahaCount: number, smileCount: number, wowCount: number, sadCount: number, angryCount: number }>, winner: string, runnersUp: string[], category: string}>
        ({ name: "none", description: "none", imgURL: "", entryNamesUrls: [], winner: "", runnersUp: [], category: ""});

    const { state } = useLocation();
    const navigate = useNavigate();

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

    const fetchInfo = async () => {
        const responseDBInfo = await fetch(`/server/challenge/${state.id}`);
        const body = await responseDBInfo.text();
        const chs = JSON.parse(body);
        const splitArray = chs.entryNames === "" ? [] : (chs.entryNames as String).split(",");

        const entries = splitArray.map(async (entryName: string) => {
            const url = await (await fetch(`/uploadsURL/${entryName}`)).text();
            const likeCount = await getReactionCount(entryName, "likeCount");
            return { entryName, url, likeCount };
        });
    
        // Sort the entries based on the like count in descending order
        const sortedEntries = await Promise.all(entries);
        sortedEntries.sort((a, b) => b.likeCount - a.likeCount);

        const maxLikes = sortedEntries[0].likeCount;
    
        // Take all entries with maximum number of likes
        var topEntries = sortedEntries.filter(
            function (sub) {
                return sub.likeCount == maxLikes;
            }
        );

        // If there is only 1 with the most likes, take all entries with the
        // second highest number of likes too
        if (topEntries.length == 1) {
            const secondEntries = sortedEntries.filter(
                function (sub) {
                    return sub.likeCount == (maxLikes - 1)
                }
            );

            topEntries = topEntries.concat(secondEntries);
        }

        const urls = topEntries.map((entry) => entry.entryName).map(async (entryName: string) => {

            const url = (await (await fetch(`/uploadsURL/${entryName}`)).text());

            const likeCount = await getReactionCount(entryName, "likeCount");
            const hahaCount = await getReactionCount(entryName, "hahaCount");
            const smileCount = await getReactionCount(entryName, "smileCount");
            const wowCount = await getReactionCount(entryName, "wowCount");
            const sadCount = await getReactionCount(entryName, "sadCount");
            const angryCount = await getReactionCount(entryName, "angryCount");

            return { entryName, url, likeCount, hahaCount, smileCount, wowCount, sadCount, angryCount };
        });

        const winningEntryDB = await (await fetch(`/getWinner/${state.id}`)).json();
        console.log("winner from DB req: " + winningEntryDB.filename);
        const winningEntry = await (await fetch(`/uploadsURL/${winningEntryDB.filename}`)).text()
        const entryNameList = topEntries.map((entry) => entry.url);

        setChallenge({
            name: chs.name as string,
            description: chs.description as string,
            imgURL: await (await fetch(`/uploadsURL/${chs.topic}`)).text(),
            entryNamesUrls: await Promise.all(urls),
            winner: winningEntry,
            runnersUp: entryNameList.filter(function (url) {return url !== winningEntry;}),
            category: (await (await fetch(`/category/${state.id}`)).json()).subject,
        });
    };

    useEffect(() => {
        fetchInfo();
    });

    const navigateToHomeScreen = () => {
        navigate('/')
    }

    return (
        <div className="announceWinner">
        {state?.id ? (
            <>
                <h1>Winner of challenge {state.id}!</h1>
                <body><img src={challengeInfo.winner} className="insImage" alt="" /></body>
                
                <h2>Runners-up</h2>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "10px",
                        flexWrap: "wrap"
                    }}>
                    {challengeInfo.runnersUp.map((entry, index) => (
                        <div
                        key={index}
                        style={{
                            border: "5px solid black",
                            margin: "0 5px",
                            textAlign: "center",
                            flex: "1",
                            width: "50%"
                        }}
                        >
                        <img src={entry} className="insImage" alt="" />
                        <br />
                        </div>
                    ))}
                </div>
                <h1>Challenge Prompt:</h1>
                    <h2>Name</h2>
                    <body>{challengeInfo.name}</body>

                    <h2>Category</h2>
                    <body>{challengeInfo.category}</body>

                    <h2>Description</h2>
                    <body>{challengeInfo.description}</body>

                    <h2>Initial Inspiration</h2>
                    <body><img src={challengeInfo.imgURL} className="insImage" alt="" /></body>
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