import React, { useEffect, useState } from 'react';
import { useSearch } from '../../features/Search/searchContext';
import { Filters } from '../../types/Filters';
import { Icon } from '../Icon/Icon';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  label: Filters;
}

export function Checkbox({ label }: CheckboxProps) {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { data: filters, setFilters } = searchContext.filters;
  const [checked, setChecked] = useState(() => {
    if (filters.indexOf(label) !== -1) {
      return true;
    }
    return false;
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChecked(e.target.checked);
    setFilters(prevFilters => {
      if (prevFilters.indexOf(label) === -1) {
        return [...prevFilters, label];
      }
      return prevFilters.filter(prevFilter => prevFilter !== label);
    });
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
