import { motion, useReducedMotion } from 'framer-motion';
import { useTextChange } from './useTextChange';

interface ChangingTextProps {
  textOptions: string[];
}

export function ChangingText({ textOptions }: ChangingTextProps) {
  const { displayedText } = useTextChange(textOptions, 5000);
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      initial={{ opacity: reduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{
        ease: 'easeOut',
        duration: 1,
      }}
      key={displayedText}
    >
      {displayedText}
    </motion.span>
  );
}
