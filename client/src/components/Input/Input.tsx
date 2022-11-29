import { ChangeEvent, useState } from 'react';
import styles from './Input.module.css';
import { ValueState } from '../../types/UserInfoForm';

interface InputProps {
  label: string;
  littleLabel?: string;
}

export function Input({ label, littleLabel }: InputProps) {
  return (
    <>
      <label className={styles.wrapper}>
        <span className={styles.label}>{label}</span>
        <input
          type='text'
          id={label}
          className={styles.input}
          // value={value[label]}
          // onChange={(e: ChangeEvent<HTMLInputElement>) =>
          //   setValue(e.target.value)
          // }
        />
        {littleLabel && (
          <span className={styles.littleLabel}>{littleLabel}</span>
        )}
      </label>
    </>
  );
}
