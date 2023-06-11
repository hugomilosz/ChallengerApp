import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

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
        date = date + ":00";
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

    const deleteChallenge = () => {
        return
    }

    const archiveChallenge = () => {
        return
    }

    return (
        <div className="noSubmissions">
            {state?.id ? (
                <>
                    <h1 style={{color: "#FF0000"}}>No Submissions for Challenge {state.id}</h1>

                    <h2>Name</h2>
                    <body>{challengeInfo.name}</body>

                    <h2>Category</h2>
                    <body>{challengeInfo.category}</body>

                    <h2>Description</h2>
                    <body>{challengeInfo.description}</body>

                    <h2>Initial Inspiration</h2>
                    <body><img src={challengeInfo.imgURL} className="insImage" alt="" /></body> <br/>

                    <h2 style={{color: "#FF0000"}}>No submissions have been made to this challenge.</h2>
                    <h3 style={{color: "#FF0000"}}>Choose an option below:</h3>
                    <div>
                        <input required type="datetime-local" style={{ marginBottom: 20 }} id="chDate" />
                        <button onClick={() => extendDeadline((document.getElementById("chDate") as HTMLInputElement).value)}>Extend the Deadline</button>
                    </div>
                    <div>
                        <button onClick={deleteChallenge}>Delete the Challenge</button>
                    </div>< br/>
                    <div>
                        <button onClick={archiveChallenge}>Archive the Challenge</button>
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