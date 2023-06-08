import * as React from 'react';
import { ReactNode } from 'react';
import styles from './Label.module.css';

type Props = {
  children?: ReactNode;
};

const Label = ({ children }: Props) => {
  return <label className={styles.Label}>{children}</label>;
};

export { Label };
