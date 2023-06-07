import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Search() {
  const [challenges, setChallenges] = useState<{ id: number; name: string }[]>([]);

  const navigate = useNavigate();

  const { query } = useParams();

  useEffect(() => {
    const queryChallenges = async () => {
      try {
        const response = await fetch("/server/search/" + query);
        const chs = JSON.parse(await response.text());

        if (Array.isArray(chs)) {
          setChallenges(chs);
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
            <span style={{ marginRight: 10 }}>{challenge.name}</span>
            <button onClick={() => viewChallengeButton(challenge.id)}>View Challenge</button>
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