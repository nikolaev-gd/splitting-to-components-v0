// app/hooks/useTextDisplay.ts

import { useState } from 'react';

export function useTextDisplay() {
  const [originalText, setOriginalText] = useState<string[]>([]);
  const [simplifiedText, setSimplifiedText] = useState<string[]>([]);
  const [showSimplified, setShowSimplified] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasText, setHasText] = useState(false);

  const handleTextSubmit = (submittedText: string) => {
    if (submittedText.trim() !== '') {
      const paragraphs = submittedText.split('\n').filter(paragraph => paragraph.trim() !== '');
      setOriginalText(paragraphs);
      setSimplifiedText([]);
      setShowOriginal(true);
      setShowSimplified(false);
      setHasText(true);
    } else {
      setHasText(false);
    }
  };

  const handleSimplify = async () => {
    setIsSimplifying(true);
    setError(null);
    try {
      console.log('Simplifying text:', originalText.join('\n'));
      const response = await fetch('/api/simplifyText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: originalText.join('\n') }),
      });

      if (!response.ok) {
        throw new Error(`Failed to simplify text: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received simplified text:', data.simplifiedText);
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Additional cleaning of the simplified text
      let cleanedText = data.simplifiedText.replace(/^(here is a simplified version of the (input )?text:?|simplified text:?)/i, '').trim();
      if (/^(here|this|following|below)/i.test(cleanedText)) {
        cleanedText = cleanedText.replace(/^[^.!?]+[.!?]\s*/i, '').trim();
      }

      setSimplifiedText(cleanedText.split('\n').filter(paragraph => paragraph.trim() !== ''));
      setShowSimplified(true);
      setShowOriginal(false);
    } catch (err) {
      console.error('Error during simplification:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSimplifying(false);
    }
  };

  const toggleOriginalText = () => {
    setShowOriginal(!showOriginal);
  };

  return {
    originalText,
    simplifiedText,
    showSimplified,
    showOriginal,
    isSimplifying,
    error,
    handleTextSubmit,
    handleSimplify,
    toggleOriginalText,
    hasText,
  };
}