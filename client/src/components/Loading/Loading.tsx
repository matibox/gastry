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

export default function Loading() {
  return (
    <motion.div
      className={styles.loading}
      variants={containerVariants}
      initial='start'
      animate='end'
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
