import React from "react";

var labelCount = 0;

interface Props {
  isChecked: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const Checkbox = (props: Props) => {
  labelCount++;
  return (
    <div>
      <label htmlFor={props.label}>{props.label}</label>
      <input
        type="checkbox"
        id={labelCount.toString()}
        checked={props.isChecked}
        onChange={props.handleChange}
      />
    </div>
  );
};
export default Checkbox;