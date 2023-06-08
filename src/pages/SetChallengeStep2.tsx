import React from "react";
import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectBox } from '../components';
import type { SelectOption } from '../components';

type ChData2 = {
    type: string
    style: string
    twist: string
}

type ChDataProps2 = ChData2 & {
    updateFields: (fields: Partial<ChData2>) => void
}

const SetChallengeStep2 = ({ type, style, twist, updateFields }: ChDataProps2) => {

    return (
        <div className="setChallengeCheckout" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>Describe outcome</h2>
            <p>Please describe the expected outcome of your challenge</p>
        
            <input required type="text" placeholder='Type' style={{ marginBottom: 10 }} name="chName" value={type} onChange={e => updateFields({ type: e.target.value })} />
            <input required type="text" placeholder='Style' style={{ marginBottom: 10 }} name="chName" value={style} onChange={e => updateFields({ style: e.target.value })} />
            <input required type="text" placeholder='Twist' style={{ marginBottom: 10 }} name="chName" value={twist} onChange={e => updateFields({ twist: e.target.value })} />
        </div >
    )
}

export default SetChallengeStep2