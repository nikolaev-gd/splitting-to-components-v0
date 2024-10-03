// app/components/InteractiveText.tsx

import React, { useState } from 'react'
import FlashcardDialog from './FlashcardDialog'
import { Flashcard } from '@/lib/types'
import { cleanWord } from '@/lib/utils'

interface InteractiveTextProps {
  text: string
  onWordClick: (word: string, sentence: string) => void
  onSaveFlashcard: (flashcard: Flashcard) => void
}

export default function InteractiveText({ text, onWordClick, onSaveFlashcard }: InteractiveTextProps) {
  const [openDialogWord, setOpenDialogWord] = useState<string | null>(null);
  const [openDialogSentence, setOpenDialogSentence] = useState<string | null>(null);

  const handleOpenDialog = (word: string, sentence: string) => {
  const cleanedWord = cleanWord(word);
  const phrasePattern = new RegExp(`\\b${cleanedWord}\\b([\\s,]*\\b\\w+\\b){0,3}`, 'i');
  const match = sentence.match(phrasePattern);
  const lexicalItem = match ? match[0].trim() : cleanedWord;
  
  setOpenDialogWord(cleanedWord);
  setOpenDialogSentence(sentence);
  onWordClick(cleanedWord, sentence, lexicalItem);
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
          {sentence.split(/\s+/).map((word, wordIndex) => (
            <React.Fragment key={`${sentenceIndex}-${wordIndex}`}>
              {word && (
                <FlashcardDialog 
                  word={cleanWord(word)} 
                  sentence={sentence.trim()}
                  onSave={(flashcard) => {
                    onSaveFlashcard(flashcard);
                    handleCloseDialog();
                  }}
                  isOpen={openDialogWord === cleanWord(word) && openDialogSentence === sentence.trim()}
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