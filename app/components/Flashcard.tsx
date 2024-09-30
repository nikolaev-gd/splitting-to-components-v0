// This code is responsible for displaying a single flashcard in our language learning app.
// It shows the word, its definition, example sentences, and an illustration.
// Users can also delete the flashcard if they no longer need it.
// The flashcard is designed to look good on both mobile phones and computers.


import React from 'react'
// Importing UI components from a custom UI library
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
// Importing an icon from the lucide-react library
import { Trash2 } from 'lucide-react'
// Importing the Flashcard type definition
import { Flashcard as FlashcardType } from '@/lib/types'
// Importing Next.js Image component for optimized image loading
import Image from 'next/image';

// This defines what information our Flashcard component needs to work
interface FlashcardProps {
    flashcard: FlashcardType  // All the information about the flashcard
    onDelete: () => void      // A function to call when we want to delete the flashcard
  }
  
  // This is our main Flashcard component
  export default function Flashcard({ flashcard, onDelete }: FlashcardProps) {
    return (
      // This Card component is like a container for our flashcard
      <Card className="mb-6 relative">
        {/* This part creates the delete button and confirmation dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {/* Delete button that triggers the AlertDialog */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              {/* Screen reader text for accessibility */}
              <span className="sr-only">Delete flashcard</span>
            </Button>
          </AlertDialogTrigger>
          {/* Content of the AlertDialog */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this flashcard?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the flashcard for &quot;{flashcard.word}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {/* Delete action that calls the onDelete prop function */}
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
  
        {/* This is where the main content of the flashcard starts */}
        <CardContent className="p-6">
          {/* This div creates a two-column layout on larger screens */}
          <div className="flex flex-col md:flex-row">
            {/* Left column: Word, Original Sentence, and Illustration */}
            <div className="md:w-2/5 pr-4 mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">{flashcard.word}</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="font-semibold">Original Sentence:</h4>
                  <p>{flashcard.originalSentence}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Illustration:</h4>
                  {/* This Image component displays the illustration for the word */}
                  <Image 
                    src={flashcard.illustration} 
                    alt={`Illustration for ${flashcard.word}`} 
                    width={500} 
                    height={300} 
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
                  <p>{flashcard.simpleDefinition}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Collocations:</h4>
                  {/* This creates a list of collocations */}
                  <ul className="list-disc list-inside">
                    {flashcard.collocations.map((collocation, index) => (
                      <li key={index}>{collocation}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Example Sentences:</h4>
                  {/* This creates a list of example sentences */}
                  <ul className="list-disc list-inside">
                    {flashcard.exampleSentences.map((sentence, index) => (
                      <li key={index}>{sentence}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }