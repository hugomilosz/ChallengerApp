import { ChangeEvent } from 'react';
import { Label } from '../Label';
import styles from './SelectBox.module.css';

type SelectOption = {
  label: string;
  value: string;
};

type Props = {
  name?: string;
  value?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  options: SelectOption[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required: boolean;
};

const SelectBox = ({
  name,
  value,
  label,
  disabled,
  className,
  options,
  onChange,
  required,
}: Props) => {
  const selectBox = (
    <select
      required={required}
      name={name}
      className={className}
      disabled={disabled}
      onChange={onChange}
      value={value}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  const result = label ? (
    <Label>
      <div className={styles.Label}>{label}</div>
      {selectBox}
    </Label>
  ) : (
    selectBox
  );

  return <div className={styles.SelectBox}>{result}</div>;
};

export { SelectBox };
export type { SelectOption };
