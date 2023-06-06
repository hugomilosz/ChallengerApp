import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      searchText: { value: string }
    };

    alert(target.searchText.value);
  }

  return (
    <form className="searchForm" onSubmit={handleSubmit}>
      <input type="text" id="searchBar" placeholder="Find a challenge!" name="searchText" />
      <input type="submit" value="Search" />
    </form>)
}