import { Box, IconButton, useTheme } from '@mui/material';
import { useContext } from 'react';
import { ColourModeContext, tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import Logo from "../../logo.svg"

const TopBar = () => {

    const navigate = useNavigate();

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);
    const colourMode: any = useContext(ColourModeContext);

    return (
        <Box>
        <Box
            display="flex"
            justifyContent="center" 
            alignContent="center" 
            p={0}
            sx={{ 
                width: "100%", 
                position: "fixed", 
                top: 0,
                backgroundColor: "transparent",
                zIndex: 9999,
                pointerEvents: "none"
            }}
        >
                <img alt="logo" src={Logo} width={35} height={35}></img>
        </Box>
        <Box 
            display="flex"
            justifyContent="space-between" 
            alignContent="center" 
            p={0}
            sx={{ 
                width: "100%", 
                position: "fixed", 
                top: 0,
                boxShadow: "0px -10px 40px black",
                backgroundColor: colours.primary[500],
                zIndex: 9998,
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
        </Box>
    );
}

export default TopBar;
