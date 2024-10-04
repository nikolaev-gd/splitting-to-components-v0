// This code creates components for displaying dialog boxes (pop-up windows) in our application.
// Dialogs are used to show important information or get input from the user without navigating away from the current page.
// The components make it easy to create, style, and manage dialogs consistently throughout the app.

import * as React from "react"
// Importing dialog primitives from Radix UI library
import * as DialogPrimitive from "@radix-ui/react-dialog"
// Importing an icon component for the close button
import { X } from "lucide-react"

// Importing a utility function to combine CSS class names
import { cn } from "@/lib/utils"

// Main Dialog component that wraps the entire dialog functionality
const Dialog = DialogPrimitive.Root

// Component to trigger the opening of the dialog (e.g., a button)
const DialogTrigger = DialogPrimitive.Trigger

// Portal component to render the dialog outside the main DOM hierarchy
const DialogPortal = DialogPrimitive.Portal
DialogPortal.displayName = DialogPrimitive.Portal.displayName

// Overlay component that dims the background when the dialog is open
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Styling for the overlay: fixed position, background blur, animations
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
      // Animation classes for opening and closing
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className // Allowing custom styles to be added
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// Content component that holds the main content of the dialog
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    {/* Overlay behind the dialog content */}
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Styling for the dialog content: positioning, size, animations
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg max-h-[85vh]",
        "translate-x-[-50%] translate-y-[-50%] gap-4",
        "border bg-background p-6 shadow-lg duration-200",
        // Animation classes for opening and closing
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        // Responsive rounded corners
        "sm:rounded-lg md:w-full",
        "overflow-hidden grid grid-rows-[auto,1fr,auto]", // Added this line
        className // Allowing custom styles to be added
      )}
      {...props}
    >
      {children} {/* Rendering the content passed to the dialog */}
      {/* Close button in the top-right corner */}
      <DialogPrimitive.Close
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity",
          "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
          "focus:ring-offset-2 disabled:pointer-events-none",
          "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
          "ring-offset-background"
        )}
      >
        {/* Close icon */}
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span> {/* Accessible text for screen readers */}
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// Header component for the dialog, typically contains the title
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Styling for layout and text alignment
      "flex flex-col space-y-1.5 text-center sm:text-left",
      "sticky top-0 bg-background pt-6 pb-2", // Added this line
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

// Footer component for the dialog, usually holds action buttons
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Styling to stack buttons on small screens and align them on larger screens
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      "sticky bottom-0 bg-background pt-2 pb-6", // Added this line
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

// Title component for the dialog header
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      // Styling for the title text
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// Description component for additional information under the title
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      // Styling for the description text
      "text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// Exporting all components for use in other parts of the application
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
