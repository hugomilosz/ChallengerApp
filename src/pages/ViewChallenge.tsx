import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Checkbox from "../checkbox/checkbox";

const ViewChallenge = () => {

    const navigate = useNavigate();


    const [challengeInfo, setChallenge] = useState<{ name: string, description: string, imgURL: string, entryNamesUrls: Array<{ url: string, likeCount: number }> }>
            ({ name: "none", description: "none", imgURL: "", entryNamesUrls: [] });

    const { state } = useLocation();

    const fetchInfo = async () => {
        const responseDBInfo = await fetch(`/server/challenge/${state.id}`);
        const body = await responseDBInfo.text();
        const chs = JSON.parse(body);
        const splitArray = chs.entryNames === "" ? [] : (chs.entryNames as String).split(",")
        const urls = splitArray.map(async (entryName: String) => {
            const entryWithoutPrefix = entryName.replace("http:/uploads/", "");
            const url = (await (await fetch(`/uploadsURL/${entryName}`)).text());
            const likeCountResponse = await fetch(`/viewReactions/${entryWithoutPrefix}/likeCount`);
            const likeCountData = await likeCountResponse.json();
            const likeCount = likeCountData.length > 0 ? likeCountData[0].likeCount : 0;
            return { url, likeCount };
        });
        setChallenge({
            name: chs.name as string,
            description: chs.description as string,
            imgURL: await (await fetch(`/uploadsURL/${chs.topic}`)).text(),
            entryNamesUrls: await Promise.all(urls)
        });
    };

    const [isCheckedLike, setIsCheckedLike] = useState(false);
    const handleChangeLike = (entry: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsCheckedLike(e.target.checked);
        const entryWithoutPrefix = entry.replace("http:/uploads/", "");
        if (e.target.checked) {
            const response = await fetch(`/updateReactions/inc/${entryWithoutPrefix}/likeCount`, {
                method: "POST",
              });
            if (response.ok) {
                console.log("Updated like count");
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
        } else {
            console.error("Failed to update like count");
        }
        }
      };

    const [isCheckedHaha, setIsCheckedHaha] = useState(false);
    const handleChangeHaha = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsCheckedHaha(e.target.checked);
    };

    const [isCheckedSmile, setIsCheckedSmile] = useState(false);
    const handleChangeSmile = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsCheckedSmile(e.target.checked);
    };

    const [isCheckedWow, setIsCheckedWow] = useState(false);
    const handleChangeWow = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsCheckedWow(e.target.checked);
    };

    const [isCheckedSad, setIsCheckedSad] = useState(false);
    const handleChangeSad = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsCheckedSad(e.target.checked);
    };

    const [isCheckedAngry, setIsCheckedAngry] = useState(false);
    const handleChangeAngry = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsCheckedAngry(e.target.checked);
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
                    {challengeInfo.entryNamesUrls.map((entry) => (
                        <body>
                        <img src={entry.url} className="insImage" alt="" />
                        <div style={{display: 'flex', justifyContent: "center"}}>
                        <div style={{ marginRight: '10px' }}>
                        <Checkbox
                            handleChange={handleChangeLike(entry.url)}
                            isChecked={isCheckedLike}
                            label={`${entry.likeCount}❤️`}
                        />
                        </div>
                        <div style={{ marginRight: '10px' }}>
                            <Checkbox
                                handleChange={handleChangeHaha}
                                isChecked={isCheckedHaha}
                                label="😂"
                            />
                        </div>
                        <div style={{ marginRight: '10px' }}>
                            <Checkbox
                                handleChange={handleChangeSmile}
                                isChecked={isCheckedSmile}
                                label="😃"
                            />
                        </div>
                        <div style={{ marginRight: '10px' }}>
                            <Checkbox
                                handleChange={handleChangeWow}
                                isChecked={isCheckedWow}
                                label="😯"
                            />
                        </div>
                        <div style={{ marginRight: '10px' }}>
                            <Checkbox
                                handleChange={handleChangeSad}
                                isChecked={isCheckedSad}
                                label="😢"
                            />
                        </div>
                        <div style={{ marginRight: '10px' }}>
                            <Checkbox
                                handleChange={handleChangeAngry}
                                isChecked={isCheckedAngry}
                                label="😡"
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