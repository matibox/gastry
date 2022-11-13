import { useEffect, useState } from 'react';

export function useTextChange(textOptions: string[], delay: number) {
  const [displayedText, setDisplayedText] = useState(textOptions[0]);

  function handleTextChange() {
    setDisplayedText(prevText => {
      const index = textOptions.indexOf(prevText) + 1;
      let textOption = textOptions[index];
      if (!textOption) textOption = textOptions[0];
      return textOption;
    });
  }

  useEffect(() => {
    const interval = setInterval(handleTextChange, delay);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { displayedText };
}
