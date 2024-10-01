// This file contains utility functions that are used across the application.
// These functions provide common, reusable functionality that can be helpful in various parts of the app.

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This function is used to combine CSS class names efficiently
export function cn(...inputs: ClassValue[]) {
  // clsx combines class names and handles conditional classes
  // twMerge efficiently merges Tailwind CSS classes
  return twMerge(clsx(inputs))
}

// This function takes an array and returns a new array with the same elements in a random order
export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the original array to avoid modifying it directly
  const shuffled = [...array]
  
  // Loop through the array from the end to the beginning
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap the elements at positions i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  // Return the shuffled array
  return shuffled
}