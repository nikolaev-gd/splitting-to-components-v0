// app/components/FlashcardDialog.tsx

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Flashcard } from '@/lib/types'
import Image from 'next/image'

interface FlashcardDialogProps {
  word: string
  sentence: string
  onSave: (flashcard: Flashcard) => void
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function FlashcardDialog({ word, sentence, onSave, children, isOpen, onOpenChange }: FlashcardDialogProps) {
  const [flashcardData, setFlashcardData] = useState<Flashcard | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchFlashcardData()
    }
  }, [isOpen, word, sentence])

  const fetchFlashcardData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generateFlashcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetWord: word, initialSentence: sentence })
      })
      const data = await response.json()
      setFlashcardData(data)
    } catch (error) {
      console.error('Error fetching flashcard data:', error)
    }
    setLoading(false)
  }

  const handleSave = () => {
    if (flashcardData) {
      onSave(flashcardData)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{word}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>Loading...</div>
        ) : flashcardData ? (
          <div className="grid gap-4 py-4">
            <p>Lexical Item: {flashcardData.lexicalItem}</p>
            <p>Original Sentence: {flashcardData.originalSentence}</p>
            {flashcardData.illustration && (
              <Image 
                src={flashcardData.illustration} 
                alt={`Illustration for ${flashcardData.word}`}
                width={300}
                height={200}
              />
            )}
            <p>Definition: {flashcardData.simpleDefinition}</p>
            {flashcardData.collocations && flashcardData.collocations.length > 0 && (
              <p>Collocations: {flashcardData.collocations.join(', ')}</p>
            )}
            <p>Context Sentence: {flashcardData.contextSentence}</p>
          </div>
        ) : (
          <div>Error loading flashcard data</div>
        )}
        <DialogFooter>
          <Button onClick={handleSave} disabled={!flashcardData}>Save Flashcard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}