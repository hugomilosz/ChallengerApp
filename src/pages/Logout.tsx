import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState<Boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/server/logOut").then(() => {
      setLoggedOut(true)
      navigate('/');
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  fetch("./server/logOut", { method: "POST" });

  return (
    <div className="logout">
      {loggedOut ? <h1>Successfully Logged out</h1> : <h1>Logging Out</h1>}
    </div>
  )
}

export default Logout
