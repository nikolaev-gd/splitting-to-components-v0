// This code creates simple and reusable pieces (components) for displaying information in a "card" layout on a website.
// A card is like a container that holds content such as titles, text, images, or buttons.
// These components help us consistently design and display cards throughout the application in an organized and visually appealing way.

import * as React from "react"

// Import a utility function 'cn' to combine CSS class names based on certain conditions
import { cn } from "@/lib/utils"

// The main Card component that acts as a container for all other card-related components
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref} // Allows parent components to access the DOM element directly
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // Default styling for the card
      className // Additional custom styles passed as props
    )}
    {...props} // Spreads any other props onto the div (like onClick events)
  />
))
Card.displayName = "Card" // Name used for debugging in React DevTools

// Component for the header section of the card
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6", // Styles for layout and spacing
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Component for the title text in the card header
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Styles for making the title prominent
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// Component for a descriptive text under the title
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground", // Styles for smaller, muted text
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// Component for the main content area of the card
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 pt-0", // Padding with no top padding to align with header
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

// Component for the footer section of the card
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0", // Flex layout to align items horizontally
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Export all the components so they can be used in other parts of the application
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
