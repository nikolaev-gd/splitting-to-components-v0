// This component creates a pop-up window (dialog) that shows information about a word
// when a user clicks on it in the text they're reading. It displays the word's definition,
// example sentences, and related words. Users can also save this information as a flashcard
// to study later. Think of it as a digital vocabulary card that appears when you click on
// an unfamiliar word while reading.

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Flashcard } from '@/lib/types'
import Image from 'next/image'

// This section defines what information the FlashcardDialog needs to work
interface FlashcardDialogProps {
  word: string                              // The word to display information about
  onSave: (flashcard: Flashcard) => void    // Function to call when saving a new flashcard
  children: React.ReactNode                 // The element that triggers the dialog to open (usually the word in the text)
  isOpen: boolean                           // Whether the dialog is currently open or closed
  onOpenChange: (open: boolean) => void     // Function to call when the dialog's open state changes
}

// This is the main function that creates the FlashcardDialog component
export default function FlashcardDialog({ word, onSave, children, isOpen, onOpenChange }: FlashcardDialogProps) {
  // This function is called when the user clicks the "Save" button
  const handleSave = () => {
    // Create a new flashcard with default information
    const newFlashcard: Flashcard = {
      id: Date.now().toString(),            // Generate a unique ID for the flashcard
      word: word,
      folder: "Default",
      originalSentence: "Example original sentence containing the word.",
      simpleDefinition: "A simple definition of the word.",
      collocations: ["collocation 1", "collocation 2"],
      exampleSentences: ["Example sentence 1.", "Example sentence 2."],
      illustration: "/images/placeholder.png",
      isStarred: false
    }
    onSave(newFlashcard)  // Save the new flashcard
    onOpenChange(false)   // Close the dialog after saving
  }

  // This section creates the actual dialog box and its contents
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* This allows the parent component to decide what triggers the dialog */}
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      {/* This is the main content of the dialog */}
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{word}</DialogTitle>
          <DialogDescription>
            Information about the word &ldquo;{word}&rdquo; and options to save it as a flashcard.
          </DialogDescription>
        </DialogHeader>
        {/* This creates a two-column layout on larger screens */}
        <div className="flex flex-col md:flex-row">
          {/* Left column: Word, Original Sentence, and Illustration */}
          <div className="md:w-2/5 pr-4 mb-4 md:mb-0">
            <div className="space-y-2">
              <div>
                <h4 className="font-semibold">Lexical Unit:</h4>
                <p>{word}</p>
              </div>
              <div>
                <h4 className="font-semibold">Original Sentence:</h4>
                <p>Example original sentence containing the word.</p>
              </div>
              <div>
                <h4 className="font-semibold">Illustration:</h4>
                <Image
                    src="/images/placeholder.png"
                    alt={`Illustration for ${word}`}
                    width={200}
                    height={200}
                    className="mt-2 max-w-full h-auto"
                    />
              </div>
            </div>
          </div>
          {/* Right column: Definition, Collocations, and Example Sentences */}
          <div className="md:w-3/5 md:pl-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Simple Definition:</h4>
                <p>A simple definition of the word.</p>
              </div>
              <div>
                <h4 className="font-semibold">Collocations:</h4>
                <ul className="list-disc list-inside">
                  <li>collocation 1</li>
                  <li>collocation 2</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Example Sentences:</h4>
                <ul className="list-disc list-inside">
                  <li>Example sentence 1.</li>
                  <li>Example sentence 2.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Footer with the save button */}
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}