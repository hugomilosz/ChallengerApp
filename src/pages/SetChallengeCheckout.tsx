import React from 'react';
import { useState } from 'react';
import { TextField, styled, useTheme, Tooltip, Button, Select, MenuItem, ClickAwayListener, FormControl, InputLabel, } from '@mui/material';
import { tokens } from '../theme';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers-pro';
import { useNavigate } from 'react-router-dom';

const SetChallengeCheckout = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            chName: { value: string },
            chCtgr: { value: string },
            chDesc: { value: string },
            chTags: { value: string },
            chFile: { files: FileList },
            chDate: { value: string }
        };

        const formData = new FormData();
        formData.append("name", target.chName.value);
        formData.append("ctgr", target.chCtgr.value);
        formData.append("desc", target.chDesc.value);
        formData.append("tags", target.chTags.value);
        formData.append("file", target.chFile.files[0], target.chFile.files[0].name);
        formData.append("date", target.chDate.value);

        fetch('./server/isLoggedIn').then((response) => {
            if (response.status === 204) {
                alert("You must be logged in to submit a Challenge!");
                return;
            }
        });

        const response = await fetch('./server/createChallenge', {
            method: 'POST',
            body: formData,
        })
        if (response.status === 200) {
            alert("Challenge created!");
            navigate("/");
        } else {
            alert("Error creating challenge!");
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

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    return (
        <div className="setChallengeCheckout" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Set the Challenge</h1>
            <form onSubmit={handleSubmit} id="form" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

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
                                <Button sx={{ color: colours.yellow[500] }} onClick={() => setOpen1(true)}>?</Button>
                            </Tooltip>
                        </div>
                    </ClickAwayListener>
                </div>

                <FormControl>
                    <InputLabel sx={{
                        "&.Mui-focused": {
                            color: colours.yellow[500],
                        }
                    }}>Category *</InputLabel>
                    <Select
                        required
                        label="Categoty"
                        name='chCtgr'
                        sx={{
                            width: 200,
                            maxWidth: 200,
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: `${colours.yellow[500]} !important`,
                                color: colours.yellow[500],
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
                        style={{
                            marginTop: 20,
                            marginBottom: 10,
                            width: 300,
                            maxWidth: 300
                        }}
                        name="chDesc"
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
                                <Button sx={{ color: colours.yellow[500] }} onClick={() => setOpen2(true)}>?</Button>
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
                        style={{
                            marginBottom: 10,
                            width: 300,
                            maxWidth: 300
                        }}
                        name="chTags"
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
                                <Button sx={{ color: colours.yellow[500] }} onClick={() => setOpen3(true)}>?</Button>
                            </Tooltip>
                        </div>
                    </ClickAwayListener>
                </div>


                <input required type="file" id="myFiles" accept="image/*" multiple style={{ marginBottom: 30, marginTop: 20 }} name="chFile" />

                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DateTimePicker

                        sx={{ paddingBottom: 20, marginBottom: 30, width: 200, maxWidth: 200 }}
                        label="Deadline"
                        slotProps={{
                            textField: {
                                name: "chDate",
                                required: true,
                                sx: {
                                    '& .MuiOutlinedInput-root': {
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

                <Button
                    variant="contained"
                    color='secondary'
                    style={{
                        marginBottom: 10,
                        marginTop: 30,
                        width: 150,
                        maxWidth: 150
                    }}
                    type='submit'>
                    Set Challenge
                </Button>
            </form>
        </div >
    )
}

export default SetChallengeCheckout;
