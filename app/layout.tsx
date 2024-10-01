// This code sets up the main layout for our Flashcard App.
// It defines the basic structure and appearance that will be consistent across all pages of the app.
// Think of it as a template that wraps around every page, ensuring the app looks and feels the same throughout.

import './globals.css' // Import global CSS styles that apply to the entire app
import type { Metadata } from 'next' // Import type definitions for metadata from Next.js
import { Inter } from 'next/font/google' // Import the Inter font from Google Fonts using Next.js

// Load the Inter font with Latin character support
const inter = Inter({ subsets: ['latin'] })

// Define metadata for the website, like the title and description shown in browsers and search engines
export const metadata: Metadata = {
  title: 'Flashcard App', // The title that appears on the browser tab and in search results
  description: 'Learn and review with interactive flashcards', // A brief description of what the app does
}

// The RootLayout component wraps around all the pages in the app
export default function RootLayout({
  children, // The content of the specific page being rendered
}: {
  children: React.ReactNode // Type definition for the children prop
}) {
  return (
    <html lang="en"> {/* Set the language of the document to English */}
      <body className={inter.className}> {/* Apply the Inter font to the body */}
        {children} {/* Render the page's content inside the body */}
      </body>
    </html>
  )
}
