// import React from "react";

const ViewChallenge = () => {
    return (
        <div className="viewChallenge">
            <h1>View a Challenge</h1>
            <form>
                <h2>Name</h2>
                <body> Get request here to get name </body>

                <h2>Description</h2>
                <body> Get request here to get challenge description </body>

                <h2>Initial Inspiration</h2>
                <body> Get request here to get the initial inspiration </body>

                {/* add actual submission (image/text) */}
                <button> Upload Submission </button>
            </form>
        </div>
    )
}

export default ViewChallenge