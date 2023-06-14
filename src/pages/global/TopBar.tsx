import { Box, IconButton, useTheme } from '@mui/material';
import { useContext } from 'react';
import { ColourModeContext, tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const TopBar = () => {

    const navigate = useNavigate();

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);
    const colourMode: any = useContext(ColourModeContext);

    return (
        <Box 
            display="flex"
            justifyContent="space-between" 
            p={0}
            sx={{
                alignContent: "center",
                position: "fixed",
                width: "100%",
                backgroundColor: colours.primary[500]
            }}
        >   
            <Box 
                sx={{
                    top: 0,
                    left: 0,
                }}
            >
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRoundedIcon />
                </IconButton>
            </Box> 
            
            <Box>
                <IconButton onClick={colourMode.toggleColourMode}>
                    {theme.palette.mode === "light" ? (
                        <DarkModeRoundedIcon />
                    ) : (
                        <LightModeRoundedIcon />
                    )}
                </IconButton>

                <IconButton onClick={() => navigate("/logout")}>
                    <LogoutRoundedIcon />
                </IconButton>
            </Box> 
        </Box>
    );
}

export default TopBar;
