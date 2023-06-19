import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Checkbox from "../checkbox/checkbox";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ViewChallenge = () => {

  const navigate = useNavigate();

  const [currentUsername, setCurrentUsername] = useState<string>();
  const [isLoggedIn, setLoggedIn] = useState<boolean>();

  const [selectedReaction, setSelectedReaction] = useState<{ [entry: string]: string }>({});
  const [deadline, setDeadlineDate] = useState<Date | null>(null);

  const [isCheckedLike, setIsCheckedLike] = useState<{ [entry: string]: boolean }>({});

  const [challengeInfo, setChallenge] = useState<{ name: string, description: string, imgURL: string, category: string, setter: string }>
    ({ name: "none", description: "none", imgURL: "", category: "", setter: "" });

  const [entryNamesUrls, setEntryNamesUrls] = useState<Array<{ entryName: string, url: string, likeCount: number, hahaCount: number, smileCount: number, wowCount: number, sadCount: number, angryCount: number }>>([]);

  const [requestingReload, setRequestingReload] = useState<boolean>(false);

  const { state } = useLocation();

  useEffect(() => {
    fetch("/server/isLoggedIn").then((response) => {
      if (response.status === 204) {
        setLoggedIn(false);
      }
      if (response.status === 200) {
        response.text().then((body) => {
          const obj = JSON.parse(body);
          console.log(`Logged in as ${obj.username}`);
          setCurrentUsername(obj.username);
          setLoggedIn(true);
        })
      }
    }
    );

    // Get the challenges this user has liked, and then set the checkboxes
    if (!state) { return; }

    fetch(`/server/getLikes/${state.id}`).then(async (liked) => {
      if (liked.status === 200) {
        const likedPosts = JSON.parse(await liked.text()) as Array<string>;
        likedPosts.forEach((filename) => {
          setIsCheckedLike((isChecked) => ({ ...isChecked, [filename]: true }));
        });
      }
    });

    // Same as above but for reactions
    fetch(`server/getReacts/${state.id}`).then(async (reacts) => {
      if (reacts.status === 200) {
        const postReacts = JSON.parse(await reacts.text()) as Array<{ filename: string, reaction: string }>;
        postReacts.forEach((reaction) => {
          setSelectedReaction((savedReactions) => ({ ...savedReactions, [reaction.filename]: reaction.reaction }));
        })
      }
    });

  }, [state]);

  const [submissionsArray, setSubmissionsArray] = useState<string[]>([]);

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

  // Runs once if you are not the challenge owner, many times if you are
  const fetchSubmissions = async () => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");

    const responseDBInfo = await fetch(`/server/challenge/${state.id}`);
    const body = await responseDBInfo.text();
    const chs = JSON.parse(body);
    const splitArray = chs.entryNames === "" ? [] : (chs.entryNames as String).split(",")
    const sortedArray = (chs.username === currentUsername) ? splitArray : splitArray.sort((a, b) => 0.5 - Math.random());

    console.log(currentUsername);

    console.log("Sorting as if " + (chs.username === currentUsername));

    console.log(sortedArray);

    setSubmissionsArray(sortedArray);

    const deadlineDate = new Date(chs.date);
    console.log("deadlineDate ", deadlineDate);
    setDeadlineDate(deadlineDate);

    setChallenge({
      name: chs.name as string,
      description: chs.description as string,
      imgURL: await (await fetch(`/uploadsURL/${chs.topic}`)).text(),
      category: (await (await fetch(`/category/${state.id}`)).json()).subject,
      setter: chs.username,
    });
  }

  // Fetches vote and URL data for each challenge
  const fetchInfo = async () => {
    console.log(submissionsArray);

    const newInfo = submissionsArray.map(async (entryName: string) => {
      console.log("Fetching " + entryName);

      const url = (await (await fetch(`/uploadsURL/${entryName}`)).text());

      const likeCount = await getReactionCount(entryName, "likeCount");
      const hahaCount = await getReactionCount(entryName, "hahaCount");
      const smileCount = await getReactionCount(entryName, "smileCount");
      const wowCount = await getReactionCount(entryName, "wowCount");
      const sadCount = await getReactionCount(entryName, "sadCount");
      const angryCount = await getReactionCount(entryName, "angryCount");

      return { entryName, url, likeCount, hahaCount, smileCount, wowCount, sadCount, angryCount };
    });

    Promise.all(newInfo).then((urls) => {
      setEntryNamesUrls(urls);
    });
  };

  // Socket setup
  useEffect(() => {
    if (state.id) {
      const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:');
      const socketUrl = socketProtocol + '//' + window.location.hostname + (window.location.hostname === "localhost" ? ":5000" : "") + '/watchChallenge';
      const socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        console.log("Socket opened");
        socket.send(state.id);
      }

      socket.onmessage = (msg) => {
        console.log(msg.data);
        if (msg.data === 'update') {
          if (currentUsername === challengeInfo.setter) {
            fetchSubmissions();
          } else {
            setRequestingReload(true);
          }
        }
        if (msg.data === 'deadline') {
          window.location.reload();
        }
      }
    }

  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeLike = (entry: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Disable the fieldset
    e.target.closest("fieldset")!.disabled = true;

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

    // Re-enable the fieldset
    e.target.closest("fieldset")!.disabled = false;
  };


  const handleChangeReaction = (entry: string, reaction: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Disable the fieldset
    e.target.closest("fieldset")!.disabled = true;

    let previouslyChecked = selectedReaction[entry];
    if (!previouslyChecked) {
      previouslyChecked = "";
    }
    const updatedSelectedReaction = { ...selectedReaction };

    if (updatedSelectedReaction[entry] === reaction) {
      // If the same reaction is already selected, deselect it
      delete updatedSelectedReaction[entry];
    } else {
      // Select the new reaction
      updatedSelectedReaction[entry] = reaction;
    }
    console.log("previously: ", previouslyChecked);
    setSelectedReaction(updatedSelectedReaction);

    // Decrement logic for previous reaction
    if (previouslyChecked !== "") {
      const entryWithoutPrefix = entry.replace("http:/uploads/", "");
      const decrementResponse = await fetch(
        `/updateReactions/dec/${entryWithoutPrefix}/${previouslyChecked}`,
        {
          method: "POST",
        }
      );

      if (decrementResponse.ok) {
        console.log("Decremented previous reaction count: ", previouslyChecked);
        await fetchInfo();
      } else {
        console.error("Failed to decrement previous reaction count");
      }
    }

    const entryWithoutPrefix = entry.replace("http:/uploads/", "");

    if (e.target.checked) {

      // Increment logic
      const incrementResponse = await fetch(
        `/updateReactions/inc/${entryWithoutPrefix}/${reaction}`,
        {
          method: "POST",
        }
      );

      if (incrementResponse.ok) {
        console.log("Incremented reaction count: ", reaction);
        await fetchInfo();
      } else {
        console.error("Failed to increment reaction count");
      }
    }

    // Re-enable the fieldset
    e.target.closest("fieldset")!.disabled = false;
  };

  useEffect(() => {
    const fetchChallengeInfo = async () => {
      if (submissionsArray.length === 0 && isLoggedIn !== undefined) {
        console.log("Bigfetch");

        await fetchSubmissions();
      } else {
        console.log("Smallfetch");

        await fetchInfo();
      }
      console.log("deadline ", deadline);
    };

    const checkDeadlinePass = async () => {
      const currentDate = new Date();
      if (deadline && currentDate > deadline) {
        const response = await (await fetch(`/checkArchived/${state.id}`)).json();

        try {
          const winningEntry = await (await fetch(`/getWinner/${state.id}`)).json();
          console.log("winningentry: ", winningEntry.filename);

          if (submissionsArray.length === 0) {
            console.log("Reponse from archived: ", response.archived);

            if (response.archived === 1) {
              let path = '../noWinner';
              navigate(path, { state: { id: state.id }, replace: true });
            } else {
              //let path = '../noSubmissions';
              const path = await (await fetch(`/server/isOwner/${state.id}/empty`)).text();
              navigate(path, { state: { id: state.id }, replace: true });
            }
          }
          else if (!winningEntry || winningEntry.length === 0) {
            // if the challenge-setter, go to chooseWinner. Otherwise, go to winnerPending 
            let path = await (await fetch(`/server/isOwner/${state.id}`)).text();
            navigate(path, { state: { id: state.id }, replace: true });
          } else {
            let path = '../announceWinner';
            navigate(path, { state: { id: state.id }, replace: true });
          }
        }
        catch (error) {
          if (submissionsArray.length === 0) {
            console.log("Reponse from archived in catch: ", response.archived);
            if (response.archived === 1) {
              let path = '../noWinner';
              navigate(path, { state: { id: state.id } });
            } else {
              //let path = '../noSubmissions';
              const path = await (await fetch(`/server/isOwner/${state.id}/empty`)).text();
              navigate(path, { state: { id: state.id } });
            }
          } else {
            // if the challenge-setter, go to chooseWinner. Otherwise, go to winnerPending 
            let path = await (await fetch(`/server/isOwner/${state.id}`)).text();
            navigate(path, { state: { id: state.id } });
          }
        }
      }
    }

    fetchChallengeInfo();
    if (deadline) {
      checkDeadlinePass();
    }
  }, [deadline, submissionsArray, isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

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
      fetchSubmissions();
    } else {
      alert("Error creating submission!");
    }
  }

  const navigateToHomeScreen = () => {
    navigate('/')
  }

  const theme = useTheme();
  const colours = tokens(theme.palette.mode);

  return (
    <div className="viewChallenge" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 20 }}>
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
              borderRadius: 3

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
                  color: colours.greenAcc[500],
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {deadline?.toLocaleString()}
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
            variant="h4"
            sx={{
              position: "relative",
              color: colours.primary[900],
              textTransform: 'none',
              marginLeft: 3,
              marginRight: 3,
              marginTop: 4,
              marginBottom: 2,
              fontWeight: 600,
            }}
          >
            Upload submission
          </Typography>
          {isLoggedIn ? <form onSubmit={handleSubmitSubmission} id="form" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <input type="file" id="myFiles" accept="image/*" style={{ marginBottom: 10 }} name="file" />
            <Button
              variant="contained"
              color='secondary'
              style={{
                marginBottom: 10,
                marginTop: 10,
                width: 150,
                maxWidth: 150
              }}
              type='submit'>
              Submit
            </Button>
          </form> :
            <Typography
              variant="h5"
              style={{
                position: "relative",
                color: colours.redAcc[500],
                textTransform: 'none',
                fontWeight: 500,
                marginBottom: 3,
              }}
            >
              You must be logged in to submit to this Challenge
            </Typography>}

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
          <Typography
            variant="h5"
            sx={{
              position: "relative",
              left: 0,
              color: colours.greenAcc[500],
              textTransform: 'none',
              textAlign: "left",
              fontWeight: 500,
              marginLeft: 3,
              marginRight: 3,
            }}
          >*use ❤️ to vote for your favourite</Typography>
          {entryNamesUrls.map((entry) => (
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

              {isLoggedIn && <div style={{ display: 'flex', justifyContent: "center" }}>
                <fieldset id={`fs${entry.entryName}`} style={{ border: "0" }}>
                  <div style={{ width: 40, maxWidth: 40, marginRight: '20px', display: "inline-block" }}>
                    <Checkbox
                      handleChange={handleChangeLike(entry.entryName)}
                      isChecked={isCheckedLike[entry.entryName] || false}
                      label={` ❤️ ${entry.likeCount} `}
                    />
                  </div>
                  <div style={{ width: 40, maxWidth: 40, marginRight: '20px', display: "inline-block" }}>
                    <Checkbox
                      handleChange={handleChangeReaction(entry.entryName, "hahaCount")}
                      isChecked={selectedReaction[entry.entryName] === "hahaCount"}
                      label={` 😂 ${entry.hahaCount} `}
                    />
                  </div>
                  <div style={{ width: 40, maxWidth: 40, marginRight: '20px', display: "inline-block" }}>
                    <Checkbox
                      handleChange={handleChangeReaction(entry.entryName, "smileCount")}
                      isChecked={selectedReaction[entry.entryName] === "smileCount"}
                      label={` 😃 ${entry.smileCount} `}
                    />
                  </div>
                  <div style={{ width: 40, maxWidth: 40, marginRight: '20px', display: "inline-block" }}>
                    <Checkbox
                      handleChange={handleChangeReaction(entry.entryName, "wowCount")}
                      isChecked={selectedReaction[entry.entryName] === "wowCount"}
                      label={` 😯 ${entry.wowCount} `}
                    />
                  </div>
                  <div style={{ width: 40, maxWidth: 40, marginRight: '20px', display: "inline-block" }}>
                    <Checkbox
                      handleChange={handleChangeReaction(entry.entryName, "sadCount")}
                      isChecked={selectedReaction[entry.entryName] === "sadCount"}
                      label={` 😢 ${entry.sadCount} `}
                    />
                  </div>
                  <div style={{ width: 40, maxWidth: 40, marginRight: '20px', display: "inline-block" }}>
                    <Checkbox
                      handleChange={handleChangeReaction(entry.entryName, "angryCount")}
                      isChecked={selectedReaction[entry.entryName] === "angryCount"}
                      label={` 🤩 ${entry.angryCount} `}
                    />
                  </div>
                </fieldset>
              </div>}
            </body>
          ))}
          {requestingReload && <h3 style={{ color: "#42a642" }}>Reload to Reshuffle and Refresh Submissions!</h3>}
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
