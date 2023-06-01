import React from "react";

const MakeChallenge = () => {
    return (
        <div className="makeChallenge">
            <h1>Make a Challenge</h1>
            <form>
                <input type="text" placeholder='Challenge Name' />
                <textarea name="Description" cols={40} rows={5} placeholder='Description'></textarea>
                {/* add initial inspiration (image/text) */}
                <button>Post Challenge</button>
            </form>
        </div>
    )
}

export default MakeChallenge