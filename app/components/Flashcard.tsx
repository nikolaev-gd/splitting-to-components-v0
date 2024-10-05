// app/components/Flashcard.tsx

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2, Star } from 'lucide-react'
import { Flashcard as FlashcardType } from '@/lib/types'
import Image from 'next/image'
import { useFlashcardContext } from '../contexts/FlashcardContext'

interface FlashcardProps {
  flashcard: FlashcardType
}

export default function Flashcard({ flashcard }: FlashcardProps) {
  const { deleteFlashcard, starCard } = useFlashcardContext();

  return (
    <Card className="mb-6 relative">
      {/* Move the Image component to the top */}
      <div className="w-full h-48 relative">
        <Image 
          src={flashcard.illustration} 
          alt={`Illustration for ${flashcard.word}`} 
          fill // Replaced layout="fill" with fill attribute
          objectFit="cover"
        />
      </div>

      {/* AlertDialog and Star button remain unchanged */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete flashcard</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this flashcard?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the flashcard for &quot;{flashcard.word}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteFlashcard(flashcard.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-2 right-12 ${flashcard.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}
        onClick={(e) => {
          e.stopPropagation();
          starCard(flashcard.id);
        }}
      >
        <Star className="h-4 w-4" fill={flashcard.isStarred ? 'currentColor' : 'none'} />
        <span className="sr-only">Star flashcard</span>
      </Button>

      <CardContent className="p-6">
        <div className="flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl mb-2">
              {flashcard.lexicalItem.split(new RegExp(`(${flashcard.word})`, 'i')).map((part, index) => (
                <React.Fragment key={index}>
                  {part.toLowerCase() === flashcard.word.toLowerCase() ? <strong>{part}</strong> : part}
                </React.Fragment>
              ))}
            </h3>
            <div>
              <h4 className="font-semibold">Original Sentence:</h4>
              <p>{flashcard.originalSentence}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Simple Definition:</h4>
              <p>{flashcard.simpleDefinition}</p>
            </div>
            {flashcard.collocations && flashcard.collocations.length > 0 && (
            <div>
              <h4 className="font-semibold">Collocations:</h4>
              <ul className="list-disc list-inside">
                {flashcard.collocations.map((collocation, index) => (
                  <li key={index}>{collocation}</li>
                ))}
              </ul>
            </div>
            )}
            {flashcard.contextSentence && (
              <div>
                <h4 className="font-semibold">Context Sentence:</h4>
                <p>{flashcard.contextSentence}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}