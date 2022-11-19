import React, { useState } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  label: string;
}

export function Checkbox({ label }: CheckboxProps) {
  const [checked, setChecked] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChecked(e.target.checked);
  }

  return (
    <label className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      <input
        type='checkbox'
        className={styles.checkbox}
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
      />
      <span className={styles.fill}>
        <Icon name='done' />
      </span>
    </label>
  );
}
