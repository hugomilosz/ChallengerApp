import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Checkbox from "../checkbox/checkbox";

const ViewChallenge = () => {

    const navigate = useNavigate();

    const [challengeInfo, setChallenge] = useState<{ name: string, description: string, imgURL: string, entryNamesUrls: Array<{ entryName: string, url: string, likeCount: number, hahaCount: number, smileCount: number, wowCount: number, sadCount: number, angryCount: number }> }>
        ({ name: "none", description: "none", imgURL: "", entryNamesUrls: [] });

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

    const fetchInfo = async () => {
        const responseDBInfo = await fetch(`/server/challenge/${state.id}`);
        const body = await responseDBInfo.text();
        const chs = JSON.parse(body);
        const splitArray = chs.entryNames === "" ? [] : (chs.entryNames as String).split(",")
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
            entryNamesUrls: await Promise.all(urls)
        });
    };

    // const [isCheckedLike, setIsCheckedLike] = useState<{ [key: string]: boolean }>({});
    const [isCheckedHaha, setIsCheckedHaha] = useState<{ [key: string]: boolean }>({});
    const [isCheckedSmile, setIsCheckedSmile] = useState<{ [key: string]: boolean }>({});
    const [isCheckedWow, setIsCheckedWow] = useState<{ [key: string]: boolean }>({});
    const [isCheckedSad, setIsCheckedSad] = useState<{ [key: string]: boolean }>({});
    const [isCheckedAngry, setIsCheckedAngry] = useState<{ [key: string]: boolean }>({});

    const [selectedCheckbox, setSelectedCheckbox] = useState("");
    const [, setIsChecked] = useState<{ [entry: string]: { [reaction: string]: boolean } }>({});
    const [selectedReaction, setSelectedReaction] = useState<{ [entry: string]: string }>({});

    const [isCheckedLike, setIsCheckedLike] = useState<{ [entry: string]: boolean }>({});

  const handleChangeLike = (entry: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedIsCheckedLike = { ...isCheckedLike };
    updatedIsCheckedLike[entry] = e.target.checked;
    setIsCheckedLike(updatedIsCheckedLike);
        const entryWithoutPrefix = entry.replace("http:/uploads/", "");
        if (e.target.checked) {
            const response = await fetch(`/updateReactions/inc/${entryWithoutPrefix}/likeCount`, {
                method: "POST",
              });
            if (response.ok) {
                console.log("Updated like count");
                fetchInfo();
            } else {
                console.error("Failed to update like count");
            }
        } else {
          // Decrement logic
          const response = await fetch(`/updateReactions/dec/${entryWithoutPrefix}/likeCount`, {
            method: "POST",
          });
        if (response.ok) {
            console.log("Updated like count");
            fetchInfo();
        } else {
            console.error("Failed to update like count");
        }
        }
      };



const handleChangeReaction = (entry: string, reaction: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
  const updatedSelectedReaction = { ...selectedReaction };

  if (updatedSelectedReaction[entry] === reaction) {
    // If the same reaction is already selected, deselect it
    delete updatedSelectedReaction[entry];
  } else {
    // Select the new reaction
    updatedSelectedReaction[entry] = reaction;
  }

  setSelectedReaction(updatedSelectedReaction);

  if (reaction === "likeCount") {
    setIsChecked({ [entry]: { [reaction]: e.target.checked } });
  } else {
    setIsChecked((prevState) => ({
      ...prevState,
      [entry]: { [reaction]: e.target.checked },
    }));
  }

  // Update the respective checkbox state variable
  switch (reaction) {
    case "hahaCount": setIsCheckedHaha({ ...isCheckedHaha, [entry]: e.target.checked }); break;
    case "smileCount":setIsCheckedSmile({ ...isCheckedSmile, [entry]: e.target.checked }); break;
    case "wowCount": setIsCheckedWow({ ...isCheckedWow, [entry]: e.target.checked }); break;
    case "sadCount": setIsCheckedSad({ ...isCheckedSad, [entry]: e.target.checked }); break;
    case "angryCount": setIsCheckedAngry({ ...isCheckedAngry, [entry]: e.target.checked }); break;
    default: console.error("Not a valid reaction"); break;
  }

  const entryWithoutPrefix = entry.replace("http:/uploads/", "");

  if (selectedCheckbox && selectedCheckbox !== reaction) {
    const previousEntryWithoutPrefix = entry.replace("http:/uploads/", "");
    const response = await fetch(
      `/updateReactions/dec/${previousEntryWithoutPrefix}/${selectedCheckbox}`,
      {
        method: "POST",
      }
    );
    if (response.ok) {
      console.log("Decremented previous reaction count", selectedCheckbox);
      fetchInfo();
    } else {
      console.error("Failed to decrement previous reaction count");
    }
  }

  if (e.target.checked) {
    setSelectedCheckbox(reaction);

    // Increment logic
    const response = await fetch(
      `/updateReactions/inc/${entryWithoutPrefix}/${reaction}`,
      {
        method: "POST",
      }
    );
    if (response.ok) {
      console.log("Incremented reaction count: ", reaction);
      fetchInfo();
    } else {
      console.error("Failed to increment reaction count");
    }
  } else {
    if (reaction !== "likeCount") {
        setSelectedCheckbox("");
    }

    // Decrement logic for current reaction
    const response = await fetch(
      `/updateReactions/dec/${entryWithoutPrefix}/${reaction}`,
      {
        method: "POST",
      }
    );
    if (response.ok) {
      console.log("Decremented reaction count: ", reaction);
      fetchInfo();
    } else {
      console.error("Failed to decrement reaction count");
    }
  }
};

    useEffect(() => {
        fetchInfo();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmitSubmission = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            file: { files: FileList }
        };

        const formData = new FormData();
        formData.append("chId", state.id);
        formData.append("file", target.file.files[0], target.file.files[0].name);

        const response = await fetch('./server/uploadImg', {
            method: 'POST',
            body: formData,
        })
        if (response.status === 200) {
            fetchInfo();
        } else {
            alert("Error creating submission!");
        }
    }

    const navigateToHomeScreen = () => {
        navigate('/')
    }

    return (
        <div className="viewChallenge">
            {state?.id ? (
                <>
                    <h1>View Challenge {state.id}</h1>
                    <h2>Name</h2>
                    <body>{challengeInfo.name}</body>

                    <h2>Description</h2>
                    <body>{challengeInfo.description}</body>

                    <h2>Initial Inspiration</h2>
                    <body><img src={challengeInfo.imgURL} className="insImage" alt="" /></body>

                    <form onSubmit={handleSubmitSubmission} id="form" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <input type="file" id="myFiles" accept="image/*" multiple style={{ marginBottom: 10 }} name="file" />
                        <input type="submit" style={{ marginBottom: 10 }} />
                    </form>

                    <h1>Existing Submissions!</h1>
                    <h3 style={{color: "#42a642"}}>Use ❤️ to vote for your favourites!</h3>
                    {challengeInfo.entryNamesUrls.map((entry) => (
                        <body>
                            <img src={entry.url} className="insImage" alt="" />
                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                <div style={{ marginRight: '10px', backgroundColor: "#bff0a1" }}>
                                <Checkbox
                                    handleChange={handleChangeLike(entry.entryName)}
                                    isChecked={isCheckedLike[entry.entryName] || false}
                                    label={`${entry.likeCount}❤️`}
                                />
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <Checkbox
                                        handleChange={handleChangeReaction(entry.entryName, "hahaCount")}
                                        isChecked={selectedReaction[entry.entryName] === "hahaCount"}
                                        label={`${entry.hahaCount}😂`}
                                      />
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <Checkbox
                                        handleChange={handleChangeReaction(entry.entryName, "smileCount")}
                                        isChecked={selectedReaction[entry.entryName] === "smileCount"}
                                        label={`${entry.smileCount}😃`}
                                    />
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <Checkbox
                                        handleChange={handleChangeReaction(entry.entryName, "wowCount")}
                                        isChecked={selectedReaction[entry.entryName] === "wowCount"}
                                        label={`${entry.wowCount}😯`}
                                    />
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <Checkbox
                                        handleChange={handleChangeReaction(entry.entryName, "sadCount")}
                                        isChecked={selectedReaction[entry.entryName] === "sadCount"}
                                        label={`${entry.sadCount}😢`}
                                    />
                                </div>
                                <div style={{ marginRight: '10px' }}>
                                    <Checkbox
                                        handleChange={handleChangeReaction(entry.entryName, "angryCount")}
                                        isChecked={selectedReaction[entry.entryName] === "angryCount"}
                                        label={`${entry.angryCount}🤩`}
                                    />
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

export default ViewChallenge
