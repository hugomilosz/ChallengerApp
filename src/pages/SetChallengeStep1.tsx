import React, { ChangeEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Radio, RadioGroup } from "../components/SquareRadioButton/SquareRadioButton";

import artcraftIcon from "../assets/icons/categories/artcraft.png"
import culinaryIcon from "../assets/icons/categories/culinary.png"
import filmingIcon from "../assets/icons/categories/filming.png"
import gardeningIcon from "../assets/icons/categories/gardening.png"
import musicIcon from "../assets/icons/categories/music.png"
import photographyIcon from "../assets/icons/categories/photography.png"
import sportIcon from "../assets/icons/categories/sport.png"
import travelIcon from "../assets/icons/categories/travel.png"
import writingIcon from "../assets/icons/categories/writing.png"

type ChData1 = {
    category: string
}

type ChDataProps1 = ChData1 & {
    updateFields: (fields: Partial<ChData1>) => void
}

const SetChallengeStep1 = ({ category, updateFields }: ChDataProps1) => {

    const [ctgr, setCtgr] = React.useState(category);

    const onChange = (label: string) => (_: ChangeEvent<HTMLInputElement>) => {
        setCtgr(label);
        updateFields({ category: label })
    };

    return (
        <div className="setChallengeStep1">
            <h2 id="group_heading">Choose category</h2>
            <p>Please select the category that best describes your challenge</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", justifyItems: "center", alignItems: "center" }}>
                <RadioGroup>
                    <Radio id="artcraft" name="radio" checked={ctgr} value="Art & Craft" onChange={onChange} >
                        <img src={artcraftIcon} alt="" />
                        <h3>ART & CRAFT</h3>
                    </Radio>
                    <Radio id="culinary" name="radio" checked={ctgr} value="Culinary" onChange={onChange} >
                        <img src={culinaryIcon} alt="" />
                        <h3>CULINARY</h3>
                    </Radio>
                    <Radio id="videography" name="radio" checked={ctgr} value="Videography" onChange={onChange} >
                        <img src={filmingIcon} alt="" />
                        <h3>VIDEOGRAPHY</h3>
                    </Radio>
                    <Radio id="gardening" name="radio" checked={ctgr} value="Gardening" onChange={onChange} >
                        <img src={gardeningIcon} alt="" />
                        <h3>GARDENING</h3>
                    </Radio>
                    <Radio id="music" name="radio" checked={ctgr} value="Music" onChange={onChange} >
                        <img src={musicIcon} alt="" />
                        <h3>MUSIC</h3>
                    </Radio>
                    <Radio id="photography" name="radio" checked={ctgr} value="Photography" onChange={onChange} >
                        <img src={photographyIcon} alt="" />
                        <h3>PHOTOGRAPHY</h3>
                    </Radio>
                    <Radio id="sport" name="radio" checked={ctgr} value="Sport" onChange={onChange} >
                        <img src={sportIcon} alt="" />
                        <h3>SPORT</h3>
                    </Radio>
                    <Radio id="travel" name="radio" checked={ctgr} value="Travel" onChange={onChange} >
                        <img src={travelIcon} alt="" />
                        <h3>TRAVEL</h3>
                    </Radio>
                    <Radio id="writing" name="radio" checked={ctgr} value="Writing" onChange={onChange} >
                        <img src={writingIcon} alt="" />
                        <h3>WRITING</h3>
                    </Radio>
                    <Radio id="other" name="radio" checked={ctgr} value="Other" onChange={onChange} >
                        <h3>OTHER</h3>
                    </Radio>
                </RadioGroup>
            </div>
        </div>
    )
}

export default SetChallengeStep1