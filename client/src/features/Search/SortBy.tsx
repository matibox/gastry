import styles from './SortBy.module.css';
import { useSearch } from './searchContext';
import { Icon } from '../../components/Icon/Icon';
import { SortEl } from '../../types/SortBy';
import { AnimatePresence, motion } from 'framer-motion';

interface TOption {
  label: string;
  sort: SortEl;
  order: 'asc' | 'desc';
}

const options: TOption[] = [
  {
    label: 'latest',
    sort: 'updatedAt',
    order: 'asc',
  },
  {
    label: 'time',
    sort: 'cookingTime',
    order: 'asc',
  },
  {
    label: 'latest',
    sort: 'updatedAt',
    order: 'desc',
  },
  {
    label: 'time',
    sort: 'cookingTime',
    order: 'desc',
  },
];

export function SortBy() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { data: optionsOpened } = searchContext.optionsOpened;

  return (
    <AnimatePresence>
      {optionsOpened && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeIn',
          }}
        >
          <span>sort by</span>
          <div className={styles.optionsWrapper}>
            {options.map((option, i) => (
              <Option option={option} key={i} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface OptionProps {
  option: TOption;
}

function Option({ option }: OptionProps) {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { sortBy } = searchContext;

  function handleClick() {
    sortBy.setSortBy([option.sort, option.order]);
  }

  return (
    <button
      className={`${styles.btn} ${
        sortBy.data[0] === option.sort &&
        sortBy.data[1] === option.order &&
        styles.active
      }`}
      onClick={() => handleClick()}
    >
      <span>{option.label}</span>
      <Icon name={option.order === 'asc' ? 'arrow_upward' : 'arrow_downward'} />
    </button>
  );
}
