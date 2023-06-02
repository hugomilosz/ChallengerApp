import React from 'react';

const MakeChallenge = () => {

  const sendFiles = async () => {
    const formData = new FormData();
    const response = await fetch('./server/createChallenge', {
      method: 'POST',
      body: formData
    });
    const json = await response.json();
    console.log(json);
  }

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    sendFiles();
  }

  return (
    <div className="makeChallenge" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Make a Challenge</h1>
      <form onSubmit={handleSubmit} id="form" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input type="text" placeholder='Challenge Name' style={{ marginBottom: 10 }} />
        <textarea name="Description" cols={40} rows={5} placeholder='Description' style={{ marginBottom: 10 }}></textarea>
        <input type="file" id="myFiles" accept="image/jpg" multiple style={{ marginBottom: 10 }} />
        <input type="submit" style={{ marginBottom: 10 }} />
      </form>
    </div>
  )
}

export default MakeChallenge;
