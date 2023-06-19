import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Box, Button, Card, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

interface chObj {
  id: number,
  name: string,
}

export default function Search() {
  const theme = useTheme();
  const colours = tokens(theme.palette.mode);

  const [challenges, setChallenges] = useState<{ id: number, name: string, description: string, imgURL: string, deadline: Date | null, category: string }[]>([]);

  const navigate = useNavigate();

  const { query } = useParams();

  useEffect(() => {
    const queryChallenges = async () => {
      try {
        const response = await fetch("/server/search/" + query);
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
    queryChallenges();
  }, [query]);

  if (query === undefined) {
    return <></>; // Will never happen thanks to routing in App
  }

  const viewChallengeButton = (id: Number) => {
    let path = '../viewChallenge';
    navigate(path, { state: { id: id } });
  }

  console.log(query);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1>Search Results: "{query}"</h1>
      {challenges.map((challenge) => (
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
      {challenges.length === 0 &&
        <>
          <h2>No results found!</h2>
          <p>Try using a shorter query, such as 1 or 2 keywords.</p>
          <SearchBar />
        </>}
    </div>
  )
}