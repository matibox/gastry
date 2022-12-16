import { motion } from 'framer-motion';
import styles from './Modal.module.css';

interface ModalProps {
  children: JSX.Element;
}

export function Modal({ children }: ModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: 'easeIn',
      }}
      className={styles.modal}
    >
      {children}
    </motion.div>
  );
}
