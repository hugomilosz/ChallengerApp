import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TextField from "@mui/material/TextField";
import { styled, useTheme } from "@mui/material";
import { tokens } from "../theme";

export default function SearchBar() {
    
    const navigate = useNavigate();

    const theme = useTheme();
    const colours = tokens(theme.palette.mode);

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            searchText: { value: string }
        };

        if (target.searchText.value.trim() !== "") {
            navigate("/search/" + encodeURI(target.searchText.value));
        } else {
            alert("Please enter a search query");
        }
    }

    const WhiteBorderTextField = styled(TextField)`
        & label.Mui-focused {
            color: ${colours.yellow[500]};
        }
        & .MuiOutlinedInput-root {
            &.Mui-focused fieldset {
            border-color: ${colours.yellow[500]};
            }
        }
    `;


    return (
        <form className="searchForm" onSubmit={handleSubmit}>
            <WhiteBorderTextField
                id="searchBar"
                className="text"
                name="searchText"
                label="Search"
                variant="outlined"
                placeholder="Medium, Topic, Art ..."
                size="small"
                sx={{
                    backgroundColor: colours.primary[300],
                    borderRadius: 1
                }}
                
            />
            <IconButton type="submit" aria-label="search">
                <SearchRoundedIcon style={{ fill: colours.yellow[500] }} />
            </IconButton>
        </form>
    )
}