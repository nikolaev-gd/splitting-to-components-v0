import React from 'react'
import { Button } from "./ui/button"
import InteractiveText from './InteractiveText'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlashcardContext } from '../contexts/FlashcardContext'
import { Loader2 } from 'lucide-react'

interface TextDisplayProps {
  originalText: string[]
  simplifiedText: string[]
  showSimplified: boolean
  showOriginal: boolean
  isSimplifying: boolean
  error: string | null
  onSimplify: () => void
  onToggleOriginal: () => void
  hasText: boolean;
}

export default function TextDisplay({
  originalText,
  simplifiedText,
  showSimplified,
  showOriginal,
  isSimplifying,
  error,
  onSimplify,
  onToggleOriginal,
  hasText
}: TextDisplayProps) {
  const { saveFlashcard } = useFlashcardContext()

  const handleWordClick = (word: string, sentence: string) => {
    console.log(`Clicked word: ${word}, Sentence: ${sentence}`)
  }

  return (
    <div>
      {hasText && (
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Title from ChatGPT</h2>
          {!showSimplified ? (
            <Button onClick={onSimplify} disabled={isSimplifying}>
              {isSimplifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simplifying...
                </>
              ) : (
                'Simplify Text'
              )}
            </Button>
          ) : (
            <Button 
              onClick={onToggleOriginal} 
              aria-expanded={showOriginal}
              aria-controls="original-text"
            >
              {showOriginal ? 'Hide Original Text' : 'Show Original Text'}
            </Button>
          )}
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      <div className="relative">
        <AnimatePresence>
          {showOriginal && originalText && originalText.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="border p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Original Text</h3>
                {originalText.map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    <InteractiveText 
                      text={paragraph} 
                      onWordClick={handleWordClick}
                      onSaveFlashcard={saveFlashcard}
                    />
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showSimplified && simplifiedText && simplifiedText.length > 0 && (
          <div className="border p-4 mb-4">
            {simplifiedText.map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                <InteractiveText 
                  text={paragraph} 
                  onWordClick={handleWordClick}
                  onSaveFlashcard={saveFlashcard}
                />
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}