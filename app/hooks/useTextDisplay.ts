// app/hooks/useTextDisplay.ts

import { useState } from 'react';

export function useTextDisplay() {
  // State for storing the simplified text
  const [simplified, setSimplified] = useState<string[]>([]);
  // State for controlling visibility of simplified and original text
  const [showSimplified, setShowSimplified] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);

  // Function to handle text submission
  const handleTextSubmit = (submittedText: string) => {
    if (submittedText.trim() !== '') {
      // Split the text into paragraphs and filter out empty ones
      setSimplified(submittedText.split('\n').filter(paragraph => paragraph.trim() !== ''));
    }
  };

  // Function to handle text simplification
  const handleSimplify = () => {
    setShowSimplified(true);
    setShowOriginal(false);
  };

  // Function to toggle visibility of original text
  const toggleOriginalText = () => {
    setShowOriginal(!showOriginal);
  };

  return {
    simplified,
    showSimplified,
    showOriginal,
    handleTextSubmit,
    handleSimplify,
    toggleOriginalText,
  };
}