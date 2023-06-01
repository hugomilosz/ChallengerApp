import React from "react";

const ViewChallenge = () => {
    return (
        <div className="viewChallenge">
            <h1>Make a Challenge</h1>
            <form>
                <input type="text" placeholder='Challenge Name' />
                <body> Description goes here... </body>
                {/* add actual submission (image/text) */}
                <button>Upload Submission</button>
            </form>
        </div>
    )
}

export default ViewChallenge