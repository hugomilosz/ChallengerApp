import React, { useState, useEffect } from "react";

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState<Boolean>(false);

  useEffect(() => {
    fetch("/server/logOut").then(() =>
      setLoggedOut(true)
    );
  }, []);

  fetch("./server/logOut", { method: "POST" });

  return (
    <div className="logout">
      {loggedOut ? <h1>Successfully Logged out</h1> : <h1>Logging Out</h1>}
    </div>
  )
}

export default Logout