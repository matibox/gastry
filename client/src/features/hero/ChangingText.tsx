import { motion } from 'framer-motion';
import { useTextChange } from './useTextChange';

interface ChangingTextProps {
  textOptions: string[];
}

export function ChangingText({ textOptions }: ChangingTextProps) {
  const { displayedText } = useTextChange(textOptions, 5000);

  return (
    <motion.span
      initial={{ opacity: 0 }}
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
