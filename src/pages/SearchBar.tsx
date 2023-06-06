import React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      searchText: { value: string }
    };

    if (target.searchText.value.trim() != "") {
      navigate("/search/" + encodeURI(target.searchText.value));
    } else {
      alert("Please enter a search query");
    }
  }

  return (
    <form className="searchForm" onSubmit={handleSubmit}>
      <input type="text" id="searchBar" placeholder="Find a challenge!" name="searchText" />
      <input type="submit" value="Search" />
    </form>)
}