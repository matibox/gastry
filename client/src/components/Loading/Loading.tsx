import styles from './Loading.module.css';
import { motion, Transition } from 'framer-motion';

const containerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const circleVariants = {
  start: {
    y: '60%',
    opacity: 0.3,
  },
  end: {
    y: '140%',
    opacity: 1,
  },
};

const circleTransition: Transition = {
  duration: 0.6,
  repeat: Infinity,
  repeatType: 'reverse',
  ease: 'easeInOut',
};

interface LoadingProps {
  height?: string;
}

export default function Loading({ height }: LoadingProps) {
  return (
    <motion.div
      className={styles.loading}
      variants={containerVariants}
      initial='start'
      animate='end'
      style={height ? { height } : { height: '20rem' }}
    >
      <motion.div
        className={styles.circle}
        variants={circleVariants}
        transition={circleTransition}
      />
      <motion.div
        className={styles.circle}
        variants={circleVariants}
        transition={circleTransition}
      />
      <motion.div
        className={styles.circle}
        variants={circleVariants}
        transition={circleTransition}
      />
    </motion.div>
  );
}
