// This component makes text interactive in our language learning app.
// It turns each word in a given text into a clickable element.
// When a user clicks on a word, it opens a dialog with more information about that word,
// allowing the user to learn more and potentially save it as a flashcard for later study.

import React, { useState } from 'react'
import FlashcardDialog from './FlashcardDialog'
import { Flashcard } from '@/lib/types'

// This defines what information our InteractiveText component needs to work
interface InteractiveTextProps {
  text: string                              // The text to make interactive
  onWordClick: (word: string) => void       // Function to call when a word is clicked
  onSaveFlashcard: (flashcard: Flashcard) => void  // Function to call when a flashcard is saved
}

// This is our main InteractiveText component
export default function InteractiveText({ text, onWordClick, onSaveFlashcard }: InteractiveTextProps) {
  // This keeps track of which word's dialog is currently open
  const [openDialogWord, setOpenDialogWord] = useState<string | null>(null);

  // This function is called when a word is clicked
  const handleOpenDialog = (word: string) => {
    setOpenDialogWord(word);  // Open the dialog for this word
    onWordClick(word);        // Call the provided onWordClick function
  };

  // This function is called when a dialog is closed
  const handleCloseDialog = () => {
    setOpenDialogWord(null);  // Close any open dialog
  };

  return (
    <>
      {/* Split the text into words and map over each word */}
      {text.split(' ').map((word, index) => (
        <React.Fragment key={index}>
          {word && (
            // Wrap each word in a FlashcardDialog component
            <FlashcardDialog 
              word={word} 
              onSave={(flashcard) => {
                onSaveFlashcard(flashcard);  // Save the flashcard
                handleCloseDialog();         // Close the dialog after saving
              }}
              isOpen={openDialogWord === word}  // Open this dialog if it's the selected word
              onOpenChange={(open) => {
                if (!open) handleCloseDialog();  // Close the dialog if open is false
              }}
            >
              {/* This is the clickable word span */}
              <span 
                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                onClick={() => handleOpenDialog(word)}
              >
                {word}
              </span>
            </FlashcardDialog>
          )}
          {' '}  {/* Add a space after each word */}
        </React.Fragment>
      ))}
    </>
  )
}