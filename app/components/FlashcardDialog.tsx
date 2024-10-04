// app/components/FlashcardDialog.tsx

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
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
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : flashcardData ? (
          <div className="overflow-y-auto max-h-[85vh]">
            <div className="p-6">
              <h3 className="text-xl mb-4">
                {flashcardData.lexicalItem.split(new RegExp(`(${flashcardData.word})`, 'i')).map((part, index) => (
                  <React.Fragment key={index}>
                    {part.toLowerCase() === flashcardData.word.toLowerCase() ? <strong>{part}</strong> : part}
                  </React.Fragment>
                ))}
              </h3>
              <p className="mb-4">{flashcardData.originalSentence}</p>
              {flashcardData.illustration && (
                <div className="mb-4">
                  <Image 
                    src={flashcardData.illustration} 
                    alt={`Illustration for ${flashcardData.word}`}
                    width={300}
                    height={200}
                  />
                </div>
              )}
              <p className="mb-4"><strong>Definition:</strong> {flashcardData.simpleDefinition}</p>
              {flashcardData.collocations && flashcardData.collocations.length > 0 && (
                <div className="mb-4">
                  <p><strong>Collocations:</strong></p>
                  <ul className="list-disc list-inside">
                    {flashcardData.collocations.map((collocation, index) => (
                      <li key={index}>{collocation}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p><strong>Context Sentence:</strong> {flashcardData.contextSentence}</p>
            </div>
          </div>
        ) : (
          <div className="p-6">Error loading flashcard data</div>
        )}
        <DialogFooter className="p-6 pt-0">
          <Button onClick={handleSave} disabled={!flashcardData}>Save Flashcard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}