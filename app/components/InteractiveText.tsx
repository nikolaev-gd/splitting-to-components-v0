import React, { useState } from 'react'
import FlashcardDialog from './FlashcardDialog'
import { Flashcard } from '@/lib/types'

interface InteractiveTextProps {
  text: string
  onWordClick: (word: string) => void
  onSaveFlashcard: (flashcard: Flashcard) => void
}

export default function InteractiveText({ text, onWordClick, onSaveFlashcard }: InteractiveTextProps) {
  const [openDialogWord, setOpenDialogWord] = useState<string | null>(null);

  const handleOpenDialog = (word: string) => {
    setOpenDialogWord(word);
    onWordClick(word);
  };

  const handleCloseDialog = () => {
    setOpenDialogWord(null);
  };

  return (
    <>
      {text.split(' ').map((word, index) => (
        <React.Fragment key={index}>
          {word && (
            <FlashcardDialog 
              word={word} 
              onSave={(flashcard) => {
                onSaveFlashcard(flashcard);
                handleCloseDialog();
              }}
              isOpen={openDialogWord === word}
              onOpenChange={(open) => {
                if (!open) handleCloseDialog();
              }}
            >
              <span 
                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                onClick={() => handleOpenDialog(word)}
              >
                {word}
              </span>
            </FlashcardDialog>
          )}
          {' '}
        </React.Fragment>
      ))}
    </>
  )
}