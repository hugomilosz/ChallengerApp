import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();

  const { query } = useParams();

  console.log(query);

  // if (query === undefined) {
  //   navigate("/");
  // }

  return (
    <h1>{query}</h1>
  )
}