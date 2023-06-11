import React from "react";
import { Tooltip } from 'react-tooltip'

type ChData3 = {
    tags: string
    date: string
    name: string
}

type ChDataProps3 = ChData3 & {
    updateFields: (fields: Partial<ChData3>) => void
}

const SetChallengeStep3 = ({ tags, date, name, updateFields }: ChDataProps3) => {

return (
    <div className="setChallengeStep3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2>Final touches</h2>
        <p>Please complete your challenge details</p>
        <div style={{ display: "flex" }}>
            <input required type="text" placeholder='Tags' style={{ marginBottom: 10 }} name="chName" value={tags} onChange={e => updateFields({ tags: e.target.value })} />
            <div className="tags"><button>?</button></div>
            <Tooltip anchorSelect=".tags" place="top" style={{ width: "400px" }}>
                Add the tags (separated by ',') that could help find your challenge.
                Format: "tag1, tag2, tag3, etc".
            </Tooltip>
        </div>
        <p>Set Deadline:</p>
        <input required type="datetime-local" style={{ marginBottom: 10 }} name="chDeadline" value={date} onChange={e => updateFields({ date: e.target.value })} />
        <br />
        <div style={{ display: "flex" }}>
            <input required type="text" placeholder='Challenge Title' style={{ marginBottom: 10 }} name="chName" value={name} onChange={e => updateFields({ name: e.target.value })} />
            <div className="title"><button>?</button></div>
            <Tooltip anchorSelect=".title" place="top" style={{ width: "400px" }}>
                Come up with a cathcy and descriptive title for your challenge. Example: "The hottest sauce ever", "Unbelivable macro shot", etc.
            </Tooltip>
        </div>
    </div >
)
}

export default SetChallengeStep3