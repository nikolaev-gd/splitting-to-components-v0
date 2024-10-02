// app/components/Flashcard.tsx

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2, Star } from 'lucide-react'
import { Flashcard as FlashcardType } from '@/lib/types'
import Image from 'next/image';

interface FlashcardProps {
  flashcard: FlashcardType
  onDelete: () => void
  onStar: () => void
}

export default function Flashcard({ flashcard, onDelete, onStar }: FlashcardProps) {
  return (
    <Card className="mb-6 relative">
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
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-2 right-12 ${flashcard.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}
        onClick={(e) => {
          e.stopPropagation();
          onStar();
        }}
      >
        <Star className="h-4 w-4" fill={flashcard.isStarred ? 'currentColor' : 'none'} />
        <span className="sr-only">Star flashcard</span>
      </Button>

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 pr-4 mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">{flashcard.word}</h3>
            <div className="space-y-2">
              <div>
                <h4 className="font-semibold">Original Sentence:</h4>
                <p>{flashcard.originalSentence}</p>
              </div>
              <div>
                <h4 className="font-semibold">Illustration:</h4>
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

          <div className="md:w-3/5 md:pl-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Simple Definition:</h4>
                <p>{flashcard.simpleDefinition}</p>
              </div>
              <div>
                <h4 className="font-semibold">Collocations:</h4>
                <ul className="list-disc list-inside">
                  {flashcard.collocations.map((collocation, index) => (
                    <li key={index}>{collocation}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Example Sentences:</h4>
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