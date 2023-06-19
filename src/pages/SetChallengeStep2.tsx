import { Button, ClickAwayListener, TextField, Tooltip, styled, useTheme } from "@mui/material";
import React, { useState } from "react";
import { tokens } from "../theme";

type ChData2 = {
    category: string
    type: string
    style: string
    twist: string
}

type ChDataProps2 = ChData2 & {
    updateFields: (fields: Partial<ChData2>) => void
}

function getDescription(type: string, style: string, twist: string): string {
    return "For this challenge you have to submit a " + type + " with " + style + ". The twist is that " + twist + "."
}

enum tooltipValueType {
    type = "TYPES_EXAMPLES",
    style = "STYLES_EXAMPLES",
    twist = "TWISTS_EXAMPLES"
}

const TYPES_QUESTION = "What kind of submission do you expect for the challenge? ";
const TYPES_EXAMPLES = new Map<string, string>();
TYPES_EXAMPLES.set("Art & Craft", "Painting, wooden sculpture, knitted scarf, etc.");
TYPES_EXAMPLES.set("Culinary", "Muffins, Cocktail, Sauce recipe, etc.");
TYPES_EXAMPLES.set("Videography", "Sunrise timelapse, dance video, pet meme, etc.");
TYPES_EXAMPLES.set("Gardening", "Pumpkin carving, shaped hedge, flowerbed, etc.");
TYPES_EXAMPLES.set("Music", "Song cover, lip sync, sound effect of car crash, etc.");
TYPES_EXAMPLES.set("Photography", "Picture of an insect, portrait, photo-collage layout, etc.");
TYPES_EXAMPLES.set("Writing", "Poem about love, 'How I spent summer' essay, anecdote, etc.");

const STYLES_QUESTION = "With what style do you expect challenge to be performed? ";
const STYLES_EXAMPLES = new Map<string, string>();
STYLES_EXAMPLES.set("Art & Craft", "Abstract style, modern vibe, wool material, etc.");
STYLES_EXAMPLES.set("Culinary", "Chocolate chip, christmas vibe, mediterranean food, etc.");
STYLES_EXAMPLES.set("Videography", "City environment, hip-hop style, fails, etc.");
STYLES_EXAMPLES.set("Gardening", "Famous paintings design, 'Alice in Wonderland' style, tulips, etc.");
STYLES_EXAMPLES.set("Music", "Raspy voice, song of your choice, explosions and screams, etc.");
STYLES_EXAMPLES.set("Photography", "Macro shot, black&white style, birthday props, etc.");
STYLES_EXAMPLES.set("Writing", "Haiku style, exagerated dramatic events, cautionary intent, etc.");

const TWISTS_QUESTION = "What interesting twist/limitation/rule can you add to the challenge? ";
const TWISTS_EXAMPLES = new Map<string, string>();
TWISTS_EXAMPLES.set("Art & Craft", "You can only use blue and yellow colours, etc.");
TWISTS_EXAMPLES.set("Culinary", "No berries or fruits allowed, etc.");
TWISTS_EXAMPLES.set("Videography", "Only cats accepted, etc.");
TWISTS_EXAMPLES.set("Gardening", "The hedge must be not taller than 1m, etc.");
TWISTS_EXAMPLES.set("Music", "you must include word 'Love', etc.");
TWISTS_EXAMPLES.set("Photography", "No photo editing is allowed, etc.");
TWISTS_EXAMPLES.set("Writing", "You can use at most 300 words, etc.");

function renderTooltip(category: string, valueType: tooltipValueType): string {

    if (valueType === tooltipValueType.type) {
        return TYPES_QUESTION + (TYPES_EXAMPLES.get(category) ?? '');
    } else if (valueType === tooltipValueType.style) {
        return STYLES_QUESTION + (STYLES_EXAMPLES.get(category) ?? '');
    } else {
        return TWISTS_QUESTION + (TWISTS_EXAMPLES.get(category) ?? '');
    }
}


const CustomTextField = styled(TextField)(({ theme }: any) => {
    return {
        'label.Mui-focused': {
            color: tokens(theme.palette.mode).yellow[500]
        },
        /* focused */
        '.MuiInput-underline:after': {
            borderBottom: `2px solid ${tokens(theme.palette.mode).yellow[500]}`
        }
    }
});

const SetChallengeStep2 = ({ type, style, twist, updateFields, category }: ChDataProps2) => {

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    return (
        <div className="setChallengeStep2" style={{ display: "grid", gridTemplateColumns: "1fr", justifyItems: "center", alignItems: "center" }}>
            <h2>Describe outcome</h2>
            <p>Please describe the expected outcome of your challenge</p>

            <div style={{ display: "flex" }}>
                <CustomTextField theme={theme} label="Type" variant="standard" required type="text" placeholder='Type' style={{ width: 300, maxWidth: 300, marginBottom: 10 }} name="chType" value={type} onChange={e => updateFields({ type: e.target.value })} />
                <ClickAwayListener onClickAway={() => setOpen1(false)}>
                    <div>
                        <Tooltip
                            PopperProps={{
                                disablePortal: true,
                            }}
                            onClose={() => setOpen1(false)}
                            open={open1}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={renderTooltip(category, tooltipValueType.type)}
                        >
                            <Button sx={{ color: colours.yellow[500] }} onClick={() => setOpen1(true)}>?</Button>
                        </Tooltip>
                    </div>
                </ClickAwayListener>
            </div>
            <div style={{ display: "flex" }}>
                <CustomTextField theme={theme} label="Style" variant="standard" required type="text" placeholder='Style' style={{ width: 300, maxWidth: 300, marginBottom: 10 }} name="chStyle" value={style} onChange={e => updateFields({ style: e.target.value })} />
                <ClickAwayListener onClickAway={() => setOpen2(false)}>
                    <div>
                        <Tooltip
                            PopperProps={{
                                disablePortal: true,
                            }}
                            onClose={() => setOpen2(false)}
                            open={open2}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={renderTooltip(category, tooltipValueType.style)}
                        >
                            <Button sx={{ color: colours.yellow[500] }} onClick={() => setOpen2(true)}>?</Button>
                        </Tooltip>
                    </div>
                </ClickAwayListener>
            </div>
            <div style={{ display: "flex" }}>
                <CustomTextField theme={theme} variant="standard" label="Twist" multiline rows={2} maxRows={5} required placeholder='Twist' style={{ width: 300, maxWidth: 300, marginBottom: 10 }} name="chTwist" value={twist} onChange={e => updateFields({ twist: e.target.value })} />
                <ClickAwayListener onClickAway={() => setOpen3(false)}>
                    <div>
                        <Tooltip
                            PopperProps={{
                                disablePortal: true,
                            }}
                            onClose={() => setOpen3(false)}
                            open={open3}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={renderTooltip(category, tooltipValueType.twist)}
                        >
                            <Button sx={{ color: colours.yellow[500] }} onClick={() => setOpen3(true)}>?</Button>
                        </Tooltip>
                    </div>
                </ClickAwayListener>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", justifyItems: "center", alignItems: "center" }}>
                <h4>Description will be as follows (can be edited later): </h4>
                <CustomTextField disabled theme={theme} label="Description" variant="outlined" multiline rows={2} maxRows={5} required placeholder='Description' style={{ width: 400, maxWidth: 400, marginBottom: 10 }} name="chDesc" value={getDescription(type, style, twist)} />
            </div>

        </div >
    )
}

export default SetChallengeStep2