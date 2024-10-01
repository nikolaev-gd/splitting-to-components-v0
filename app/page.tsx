// This code sets up the home page of our Flashcard App.
// It imports the main flashcard component and displays it.
// When someone visits the website, this code ensures they see the interactive flashcards right away.

import React from 'react'
import FlashcardApp from '@/components/FlashcardApp' // Import the main FlashcardApp component

// Define and export the Home component as the default export
export default function Home() {
  // Render the FlashcardApp component on the home page
  return <FlashcardApp />
}
