// This code defines a Textarea component, which is a customizable text input area where users can type multiple lines of text.
// It ensures that all text areas in our application look and behave consistently, making it easier for users to interact with forms or any input fields that require longer text entries.

import * as React from "react"
// Import a utility function 'cn' to conditionally combine CSS class names
import { cn } from "@/lib/utils"

// Create the Textarea component using React.forwardRef to allow parent components to access the underlying DOM element
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      // Combine default styling with any additional classes passed via the 'className' prop
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
        "ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref} // Forward the ref to the textarea element for direct DOM access if needed
      {...props} // Spread any additional props onto the textarea element (e.g., onChange, value)
    />
  )
})

Textarea.displayName = "Textarea" // Set the display name for easier debugging in React DevTools

// Export the Textarea component so it can be used in other parts of the application
export { Textarea }
