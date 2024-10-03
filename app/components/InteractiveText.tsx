// app/components/InteractiveText.tsx

import React, { useState } from 'react'
import FlashcardDialog from './FlashcardDialog'
import { Flashcard } from '@/lib/types'

interface InteractiveTextProps {
  text: string
  onWordClick: (word: string, sentence: string) => void
  onSaveFlashcard: (flashcard: Flashcard) => void
}

export default function InteractiveText({ text, onWordClick, onSaveFlashcard }: InteractiveTextProps) {
  const [openDialogWord, setOpenDialogWord] = useState<string | null>(null);
  const [openDialogSentence, setOpenDialogSentence] = useState<string | null>(null);

  const handleOpenDialog = (word: string, sentence: string) => {
    setOpenDialogWord(word);
    setOpenDialogSentence(sentence);
    onWordClick(word, sentence);
  };

  const handleCloseDialog = () => {
    setOpenDialogWord(null);
    setOpenDialogSentence(null);
  };

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  return (
    <>
      {sentences.map((sentence, sentenceIndex) => (
        <React.Fragment key={sentenceIndex}>
          {sentence.split(' ').map((word, wordIndex) => (
            <React.Fragment key={`${sentenceIndex}-${wordIndex}`}>
              {word && (
                <FlashcardDialog 
                  word={word} 
                  sentence={sentence.trim()}
                  onSave={(flashcard) => {
                    onSaveFlashcard(flashcard);
                    handleCloseDialog();
                  }}
                  isOpen={openDialogWord === word && openDialogSentence === sentence.trim()}
                  onOpenChange={(open) => {
                    if (!open) handleCloseDialog();
                  }}
                >
                  <span 
                    className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                    onClick={() => handleOpenDialog(word, sentence.trim())}
                  >
                    {word}
                  </span>
                </FlashcardDialog>
              )}
              {' '}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </>
  )
}