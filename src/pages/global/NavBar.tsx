import { BottomNavigation, useTheme } from "@mui/material"
import { tokens } from "../../theme"
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useNavigate } from "react-router-dom";


const NavBar = () => {

    const navigate = useNavigate();

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    const BottomNavigationAction = MuiBottomNavigationAction;

    const handleChange = (event: React.SyntheticEvent, newState: string) => {
        navigate(newState);
    };

    return (
        <BottomNavigation
            onChange={handleChange}
            sx={{
                width: "100%",
                position: "fixed !important",
                bottom: 0,
                boxShadow: "0px 10px 20px black",
                backgroundColor: colours.primary[500],
                p: 3,
                zIndex: 9999,
            }}
            showLabels
        >
            <BottomNavigationAction
                label="Home"
                value="/"
                icon={<HomeRoundedIcon />}
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