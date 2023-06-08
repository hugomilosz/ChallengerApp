import React from "react";

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
    <div className="setChallengeCheckout" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2>Final touches</h2>
        <p>Please complete your challenge details</p>
        <input required type="text" placeholder='Tags' style={{ marginBottom: 10 }} name="chName" value={tags} onChange={e => updateFields({ tags: e.target.value })} />
        <input required type="datetime-local" style={{ marginBottom: 10 }} name="chDeadline" value={date} onChange={e => updateFields({ date: e.target.value })} />
        <input required type="text" placeholder='Challenge Title' style={{ marginBottom: 10 }} name="chName" value={name} onChange={e => updateFields({ name: e.target.value })} />
    </div >
)
}

export default SetChallengeStep3