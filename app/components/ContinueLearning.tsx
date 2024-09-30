import React from 'react'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface ContinueLearningProps {
  onClose: () => void
}

export default function ContinueLearning({ onClose }: ContinueLearningProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-bold">Continue Learning</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="flex-grow p-4 overflow-auto">
        <p className="text-lg">A short story from ChatGPT</p>
        {/* Add the content for continuing learning here */}
      </div>
    </div>
  )
}