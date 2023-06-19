import { useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../theme";

var labelCount = 0;

interface Props {
  isChecked: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  isLike?: boolean;
}

const Checkbox = (props: Props) => {

  const theme = useTheme();
  const colours = tokens(theme.palette.mode);

  labelCount++;
  return (
    <div
      style={{
        backgroundColor: (props.isChecked ? (props.isLike ? colours.greenAcc[900] : colours.yellow[900]) : colours.primary[400]),
        borderRadius: 3,
        border: `1px solid ${(props.isChecked ? colours.yellow[500] : colours.primary[700])}`,
        padding: 1
      }}
    >

      <input
        type="checkbox"
        id={labelCount.toString()}
        checked={props.isChecked}
        onChange={props.handleChange}
        hidden

      />
      <label htmlFor={labelCount.toString()}>{props.label}</label>
    </div>
  );
};
export default Checkbox;