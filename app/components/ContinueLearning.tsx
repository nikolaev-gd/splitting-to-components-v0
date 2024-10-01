// This component is responsible for displaying a "Continue Learning" screen in our language learning app.
// It shows a full-screen overlay with a title, close button, and space for additional learning content.
// The main purpose is to provide users with extra learning materials, like a short story, after they've
// completed their flashcard review session.

import React from 'react'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

// This defines what information our ContinueLearning component needs to work
interface ContinueLearningProps {
  onClose: () => void  // A function to call when the user wants to close this screen
}

// This is our main ContinueLearning component
export default function ContinueLearning({ onClose }: ContinueLearningProps) {
  return (
    // This div creates a full-screen white overlay
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* This is the header section with title and close button */}
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-bold">Continue Learning</h2>
        {/* This is the close button */}
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      {/* This is the main content area */}
      <div className="flex-grow p-4 overflow-auto">
        <p className="text-lg">A short story from ChatGPT</p>
        {/* This is where you would add more content, like the actual short story or other learning materials */}
      </div>
    </div>
  )
}