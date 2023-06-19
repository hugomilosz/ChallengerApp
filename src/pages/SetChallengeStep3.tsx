import { Button, ClickAwayListener, TextField, styled, useTheme, Tooltip,  } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers-pro';
import React, { useState } from "react";
import { tokens } from "../theme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type ChData3 = {
    tags: string
    date: string
    name: string
}

type ChDataProps3 = ChData3 & {
    updateFields: (fields: Partial<ChData3>) => void
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

const SetChallengeStep3 = ({ tags, date, name, updateFields }: ChDataProps3) => {

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);

return (
    <div className="setChallengeStep3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2>Final touches</h2>
        <p>Please complete your challenge details</p>
        <div style={{ display: "flex" }}>
        <CustomTextField theme={theme} label="Tags" variant="standard" required type="text" placeholder='Tags' style={{ marginBottom: 10, width: 300, maxWidth: 300 }} name="chName" value={tags} onChange={e => updateFields({ tags: e.target.value })} />
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
                        title={`Add the tags (separated by ',') that could help find your challenge.
                                Format: "tag1, tag2, tag3, etc".`}
                    >
                        <Button sx={{color: colours.yellow[500]}} onClick={() => setOpen1(true)}>?</Button>
                    </Tooltip>
                </div>
            </ClickAwayListener>
        </div>
        <p>Set Deadline:</p>
        <LocalizationProvider dateAdapter={AdapterDayjs} > 
            <DateTimePicker 
                sx={{ marginBottom: 10, width: 200, maxWidth: 200 }} 
                label="Deadline" 
                onChange={(newValue: string | null) => {updateFields({ date: (newValue === null) ? "" : newValue }); console.log(date)}}
                slotProps={{
                    textField: {
                        required: true,
                        value: date,
                        defaultValue: date,
                        sx: { '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: colours.yellow[500],
                                },
                            },
                            ' & label.Mui-focused': {
                                color: colours.yellow[500]
                            },
                            width: 300,
                            maxWidth: 300,
                        }
                    },
                }}
                format="YYYY-MM-DD HH:mm:ss"
                disablePast
            />
        </LocalizationProvider> 
        <br />
        <div style={{ display: "flex" }}>
        <CustomTextField theme={theme} variant="standard" label="Title" required type="text" placeholder='Challenge Title' style={{ marginBottom: 10, width: 300, maxWidth: 300 }} name="chName" value={name} onChange={e => updateFields({ name: e.target.value })} />
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
                        title={`Come up with a cathcy and descriptive title for your challenge. Example: "The hottest sauce ever", "Unbelivable macro shot", etc.`}
                    >
                        <Button sx={{color: colours.yellow[500]}} onClick={() => setOpen2(true)}>?</Button>
                    </Tooltip>
                </div>
            </ClickAwayListener>
        </div>
    </div >
)
}

export default SetChallengeStep3