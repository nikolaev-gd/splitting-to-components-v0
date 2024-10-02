// This component creates a text input area for users to type messages or content.
// It's designed to automatically expand as the user types more text and includes
// a submit button. It's typically used for entering text that will be processed
// or displayed elsewhere in the application, like submitting a message or query.

"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { ArrowUp } from 'lucide-react'

// Define the props that this component accepts
interface TextInputProps {
  onSubmit: (text: string) => void  // Function to call when text is submitted
}

export default function TextInput({ onSubmit }: TextInputProps) {
  // State to hold the current text in the input
  const [text, setText] = useState('')
  
  // Reference to the textarea DOM element
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Effect to adjust the height of the textarea as content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() !== '') {
      onSubmit(text)  // Call the provided onSubmit function with the text
      setText('')     // Clear the input after submission
    }
  }

  // Handle keydown events (for submitting with Enter key)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative flex-grow">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            className="pr-10 resize-none overflow-hidden"
            rows={1}
          />
          <Button 
            type="submit" 
            size="icon"
            className="absolute right-2 bottom-2"
            disabled={!text.trim()}
          >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  )
}