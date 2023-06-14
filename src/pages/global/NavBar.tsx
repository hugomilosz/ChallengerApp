import { BottomNavigation, BottomNavigationAction, Icon, useTheme } from "@mui/material"
import { useContext, useState } from "react"
import { ColourModeContext, tokens } from "../../theme"
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { styled } from "@mui/material/styles";

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useNavigate } from "react-router-dom";


const NavBar = () => {

    const navigate = useNavigate();

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    const [state, setState] = useState("/");

    const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
        &.Mui-selected {
            color: ${colours.yellow[500]};
        }
    `);

    const handleChange = (event: React.SyntheticEvent, newState: string) => {
        navigate(newState);
        setState(newState);
    };

    return (
        <BottomNavigation
            value={state}
            onChange={handleChange}
            sx={{ 
                width: "100%", 
                position: "absolute", 
                bottom: 0,
                boxShadow: "0px 10px 20px black",
                backgroundColor: colours.primary[500],
                p: 3,
            }}
            showLabels
        >
            <BottomNavigationAction 
                label="Home"
                value="/"
                icon={<HomeRoundedIcon />} 
            />
            <BottomNavigationAction 
                label="View Submissions"
                value="/viewSubmissions"
                icon={<GridViewRoundedIcon />} 
            />
            <BottomNavigationAction 
                label="Set Challenge"
                value="/setChallengeChoice"
                icon={<AddCircleOutlineRoundedIcon />} 
            />
            <BottomNavigationAction 
                label="LogIn"
                value="/login"
                icon={<PersonRoundedIcon />} 
            />
        </BottomNavigation>
    );
}

export default NavBar;