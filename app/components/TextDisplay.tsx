// TextDisplay.tsx

// This component is responsible for displaying and toggling between the original and simplified text.
// It allows users to view the text they're learning and switch between different versions.

import React from 'react';
import { Button } from "./ui/button";
import InteractiveText from './InteractiveText';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as FlashcardType } from '@/lib/types'

interface TextDisplayProps {
  simplified: string[];
  showSimplified: boolean;
  showOriginal: boolean;
  onSimplify: () => void;
  onToggleOriginal: () => void;
  onSaveFlashcard: (flashcard: FlashcardType) => void;
}

const TextDisplay: React.FC<TextDisplayProps> = ({
  simplified,
  showSimplified,
  showOriginal,
  onSimplify,
  onToggleOriginal,
  onSaveFlashcard
}) => {
  return (
    <div>
      {/* Controls for simplifying and toggling text */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Title from ChatGPT</h2>
        {!showSimplified ? (
          <Button onClick={onSimplify}>Simplify Text</Button>
        ) : (
          <Button 
            onClick={onToggleOriginal} 
            aria-expanded={showOriginal}
            aria-controls="original-text"
          >
            {showOriginal ? 'Hide Original Text' : 'Show Original Text'}
          </Button>
        )}
      </div>

      {/* Display area for text */}
      <div className="relative">
        {/* Original text */}
        <AnimatePresence>
          {showOriginal && simplified.length > 0 && (
            <motion.div
              initial={{ height: 'auto', opacity: 1 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="border p-4 mb-4">
                {simplified.map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    <InteractiveText 
                      text={paragraph} 
                      onWordClick={() => {}}
                      onSaveFlashcard={onSaveFlashcard}
                    />
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simplified text */}
        {showSimplified && simplified.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="border p-4 mb-4">
              <h2 className="text-xl font-bold mb-2">Simplified Text</h2>
              {simplified.map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  <InteractiveText 
                    text={paragraph} 
                    onWordClick={() => {}}
                    onSaveFlashcard={onSaveFlashcard}
                  />
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TextDisplay;