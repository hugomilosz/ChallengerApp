import React from 'react';
import { useState } from 'react';
import { TextField, styled, useTheme, Tooltip, Button, Select, MenuItem, ClickAwayListener, FormControl, InputLabel, } from '@mui/material';
import { tokens } from '../theme';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers-pro';

type ChData = {
    category: string
    type: string
    style: string
    twist: string
    tags: string
    date: string
    name: string
}

type ChDataProps = ChData & {
    updateFields: (fields: Partial<ChData>) => void
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

const SetChallengeCheckout = ({ category, type, style, twist, tags, date, name, updateFields }: ChDataProps) => {


    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const [ctgr, setCtgr] = useState(category);

    const onChange = (event: any) => {
        setCtgr(event.target.value);
        updateFields({ category: event.target.value })
    };

    function getDescription(type: string, style: string, twist: string): string {
        return "For this challenge you have to submit a " + type + " with " + style + ". The twist is that " + twist + "."
    }

    return (
        <div 
            className="setChallengeStep4" 
            style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center" 
            }}
        >

            <h1>Set the Challenge</h1>
            
            <div 
                style={{ 
                    display: "flex" 
                }}
            >

                <CustomTextField 
                    required
                    label="Title"
                    variant="standard"
                    type="text" 
                    placeholder='Title' 
                    style={{ 
                        marginBottom: 20,
                        width: 300,
                        maxWidth: 300
                    }} 
                    name="chName" 
                    value={name} 
                    onChange={e => updateFields({ name: e.target.value })} 
                />
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
                            title={`Come up with a cathcy and descriptive title for your challenge. Example: "The hottest sauce ever", "Unbelivable macro shot", etc.`}
                        >
                            <Button sx={{color: colours.yellow[500]}} onClick={() => setOpen1(true)}>?</Button>
                        </Tooltip>
                    </div>
                </ClickAwayListener>
            </div>
                            
            <FormControl>
            <InputLabel sx={{
                "&.Mui-focused": {
                    color: colours.yellow[500],
                  }
            }}>Category</InputLabel>
            <Select
                required
                name='chCtgr'
                label="Category"
                value={ctgr}
                onChange={onChange}
                sx={{
                    width: 200,
                    maxWidth: 200,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: `${tokens(theme.palette.mode).yellow[500]} !important`,
                        color: tokens(theme.palette.mode).yellow[500]
                    },
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: colours.yellow[500],
                        },
                    },
                    ' & label.Mui-focused': {
                        color: colours.yellow[500]
                    },
                }}
            >
                <MenuItem value={"Art & Craft"}>Art & Craft</MenuItem>
                <MenuItem value={"Culinary"}>Culinary</MenuItem>
                <MenuItem value={"Videography"}>Videography</MenuItem>
                <MenuItem value={"Gardening"}>Gardening</MenuItem>
                <MenuItem value={"Music"}>Music</MenuItem>
                <MenuItem value={"Photography"}>Photography</MenuItem>
                <MenuItem value={"Writing"}>Writing</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
            </Select>
            </FormControl>
            
            <div 
                style={{ 
                    display: "flex" 
                }}
            > 
                <CustomTextField
                    required
                    variant="standard"
                    multiline
                    rows={3}
                    maxRows={5}
                    label="Description"
                    placeholder='Description'
                    style={{ marginTop: 20, 
                            marginBottom: 10,
                            width: 300,
                            maxWidth: 300 }} 
                    name="chDesc" 
                    defaultValue={getDescription(type, style, twist)}
                />
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
                                title={`Describe your challenge and dont forget to mention your expectations and and inspiring twist`}
                        >
                                <Button sx={{color: colours.yellow[500]}} onClick={() => setOpen2(true)}>?</Button>
                        </Tooltip>
                    </div>
                </ClickAwayListener>
            </div>

            <div 
                style={{ 
                    display: "flex" 
                }}
            >
                <CustomTextField
                    required
                    variant="standard"
                    type="text"
                    label="Tags"
                    placeholder='Tags'
                    style={{ marginBottom: 10,
                             width: 300,
                             maxWidth: 300 }}
                    name="chTags"
                    value={tags}
                    onChange={e => updateFields({ tags: e.target.value })}
                />
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
                            title={`Add the tags (separated by ',') that could help find your challenge.
                                    Format: "tag1, tag2, tag3, etc".`}
                        >
                            <Button sx={{color: colours.yellow[500]}} onClick={() => setOpen3(true)}>?</Button>
                        </Tooltip>
                    </div>
                </ClickAwayListener>
            </div>

                            
            <input required type="file" id="myFiles" accept="image/*" style={{ marginBottom: 30, marginTop: 20 }} name="chFile" />
            
            <LocalizationProvider dateAdapter={AdapterDayjs} > 
                <DateTimePicker
                    
                    sx={{ paddingBottom:20, marginBottom: 30, width: 200, maxWidth: 200 }} 
                    label="Deadline" 
                    onChange={(newValue: string | null) => {updateFields({ date: (newValue === null) ? "" : newValue }); console.log(date)}}
                    slotProps={{
                        textField: {
                            name: "chDate",
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
        </div >
    )
}

export default SetChallengeCheckout;
