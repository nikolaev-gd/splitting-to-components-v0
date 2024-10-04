# EngLearner Project

## File Structure

### Root Level
- `README.md`
- `components.json`
- `next-env.d.ts`
- `next.config.mjs`
- `package-lock.json`
- `package.json`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`
- `tsconfig.tsbuildinfo`
- `yarn.lock`

### Directories

#### `app/`
- `api/`
  - `generateFlashcard/`
    - `route.ts`: API route for generating flashcards using OpenAI.
- `components/`
  - `ContinueLearning.tsx`
  - `Flashcard.tsx`: Displays a single flashcard in study mode.
  - `FlashcardApp.tsx`: Main component managing flashcards.
  - `FlashcardDialog.tsx`: Pop-up for editing and saving flashcards.
  - `FlashcardList.tsx`: Displays a list of saved flashcards.
  - `InteractiveText.tsx`: Displays clickable words in text.
  - `StudyModeController.tsx`: Controls and manages study mode.
  - `TextDisplay.tsx`: Main component displaying pasted text.
  - `TextInput.tsx`: Input field for pasting and submitting text.
  - `ui/`
    - `alert-dialog.tsx`
    - `button.tsx`
    - `card.tsx`
    - `dialog.tsx`
    - `textarea.tsx`
- `contexts/`
  - `FlashcardContext.tsx`: Global state management for flashcards.
- `globals.css`
- `hooks/`
  - `useFlashcards.ts`: Manages flashcard state and actions.
  - `useStudyMode.ts`: Controls study mode state.
  - `useTextDisplay.ts`: Handles text display and interaction logic.
- `layout.tsx`: Main layout component for structuring the app.
- `lib/`
  - `types.ts`: Type definitions used across the app.
  - `utils.ts`: Utility functions for processing.
- `page.tsx`: Main page of the application where text is entered and displayed.

#### `public/`
- `images/`
  - `placeholder.png`

## Technologies Used

- Operating System: macOS
- Code Editor: VS Code
- Framework: Next.js (v14.2.13) with App Router
- Language: TypeScript
- Package Manager: Yarn
- Version Control: Git
- Database: Supabase
- Authentication: Clerk for Authentication and User Management
- AI Integration: OpenAI API
- Image Generation: DALL-E 3

## Overview
EngLearner is an English language learning app designed to help users improve their vocabulary and comprehension using the lexical approach, which emphasizes learning words and phrases in their natural context. By integrating content that the user is genuinely interested in, EngLearner makes the process of language learning more meaningful and effective. The app leverages modern language models like OpenAI to provide personalized learning experiences.

## Motivation and Concept
EngLearner aims to enhance language learning through the lexical approach and user-chosen content, making learning more engaging by connecting it directly to the user's interests. Traditional language learning methods often present generalized examples that can be tedious and disconnected from real-life use. Instead, EngLearner allows users to study using content such as articles, books, or social media posts that are relevant to their lives and interests.

### Key Benefits
#### 1. Personalized Content
Users work with texts they personally select, allowing them to study language in a natural context rather than artificial examples. This makes learning more engaging and meaningful, leading to faster practical use of the language.

#### 2. Use of Language Models for Educational Purposes
EngLearner leverages modern language models for:
- **Simplifying complex texts**: The app automatically simplifies difficult texts to make them more accessible, while gradually increasing the difficulty.
- **Adapting learning content**: The algorithm learns from the user's chosen texts and creates relevant study materials based on their interests, writing style, and language proficiency.
- **Analyzing grammatical errors**: The app detects common mistakes made by the user, allowing targeted practice to eliminate these errors.
- **Creating personalized study materials**: Flashcards are generated with word meanings, examples, and collocations to deepen understanding of lexical items in real contexts.

#### 3. Lexical Approach
The lexical approach focuses on understanding and using common phrases, collocations, and expressions in context, rather than memorizing isolated words and grammatical rules. This method promotes:
- **Practical usage**: Users learn how words and phrases are used in context, facilitating real-life application.
- **Durable memory retention**: Understanding and using phrases in context makes them easier to remember.
- **Focus on real language**: The approach emphasizes the most commonly used and useful phrases and constructions, helping users actively use the language.

By combining personalized content with language models, the lexical approach makes learning more effective and enables users to understand and use language in contexts that matter to them.

## User Journey
1. **Getting Started**: 
   - The user finds an interesting English article.
2. **Switching to the App**: 
   - The user copies the text and opens EngLearner.
3. **Pasting the Text**: 
   - They paste the text into the Input Box and click the Send Button to view it in the Chat Window.
4. **Reading and Interaction**: 
   - Clicking a word opens a pop-up with detailed information like images, meanings, and collocations.
5. **Saving Flashcards**: 
   - Users save unfamiliar words as flashcards, which are listed below the main text.
6. **Starting Flashcard Study**: 
   - Clicking "Learn" starts the study mode for the saved flashcards.
7. **Flashcard Study Mode**: 
   - Users study the flashcards, navigate using swipe gestures, and mark difficult cards.
8. **Completing Study**: 
   - Options appear for repeating cards or continuing study.
9. **Additional Study**: 
   - Users can generate new texts for additional practice based on saved phrases.

## Features
1. **User Interface**: Chat Window, Input Box, Send Button, Hamburger Menu, and clickable words for interaction.
2. **Text Processing**: Handle large volumes of text, split it into individual words and sentences, and manage word clicks.
3. **Integration with OpenAI API**: Use OpenAI and DALL-E to generate images and provide detailed information.
4. **Pop-up Display**: Display images, definitions, collocations, and context for each selected word.
5. **Flashcard Management**: Save flashcards in a database, display them below the text, and manage them with a "Star" button.
6. **Flashcard Study Mode**: Flip cards, swipe to navigate, and mark difficult cards.
7. **Completion Options**: Repeat cards, continue studying, or generate new content.
8. **Mobile Responsiveness**: Optimize for mobile devices with swipe gestures.
9. **Error Handling**: Handle errors from API interactions and inform users.
10. **Performance and Security**: Optimize image and text loading, secure data storage, and ensure privacy.

## Target Audience
EngLearner is designed for users with a Pre-Intermediate level of English and above, who are:
- Self-motivated learners.
- Interested in improving their English skills.
- Challenged by unfamiliar vocabulary in the texts they wish to read.