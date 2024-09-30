import React, { useState, useRef, useEffect } from 'react'
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { ArrowUp } from 'lucide-react'

interface TextInputProps {
  onSubmit: (text: string) => void
}

export default function TextInput({ onSubmit }: TextInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() !== '') {
      onSubmit(text)
      setText('')
    }
  }

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