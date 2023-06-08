import React, { ChangeEvent, PropsWithChildren } from "react";
import styles from "./SquareRadioButton.module.css"


export const RadioGroup = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div
      role="radiogroup"
      className={styles.radiogroup}
      aria-labelledby="group_heading">
      {children}
    </div>
  );
};

export const Radio = ({
  children,
  id,
  name,
  value,
  checked,
  onChange,
}: PropsWithChildren<{ id: string; name: string, value: string, checked: string, onChange: (event: ChangeEvent<HTMLInputElement>) => void }>) => {
  return (
    <>
      <input required type="radio" id={id} name={name} checked={checked === value} onChange={onChange}/>
      <label className={styles.radiolabel} htmlFor={id}>
        {children}
      </label>
    </>
  );
};