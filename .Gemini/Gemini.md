# Tocino AI SPEC Builder

**Vision:** Tocino AI SPEC Builder is the bridge between your idea and your first developer: describe your product in simple words and instantly get a complete, ready-to-build technical specification.

## Core Features

*   **Input Interface:** A clean, auto-expanding text area where users can describe their product idea.
*   **Real-time Feedback:** Micro-animations and clear loading states while the AI generates the specification.
*   **Markdown Rendering:** The generated spec is rendered with rich formatting, syntax highlighting, and well-structured headings.
*   **Export Options:** One-click functionality to copy the generated spec to the clipboard or download it as a `.md` file.

## Architecture & Tech Stack

*   **Frontend:** Next.js 16 with React (App Router) handles the UI, routing, and rendering. Tailwind CSS manages the visual design with utility classes.
*   **Backend:** A Next.js API Route (`/api/generate-spec`) acts as an intermediary layer between the client and the AI to protect SDK credentials.
*   **AI Integration:** The `@google/generative-ai` SDK is used in the API Route to call the Gemini model. The system prompt defines the structure, and the user input provides the context.
*   **Deployment:** Vercel automatically detects the Next.js project and manages environments.
*   **Database:** None.
*   **Authentication:** None.

## UI/UX & Styling Guidelines

*   **Premium Aesthetics:** The interface must look modern and high-end. Utilize a polished color palette (e.g., sleek dark mode with vibrant accent colors), glassmorphism effects, and smooth gradients.
*   **Typography:** Use modern web fonts (e.g., Inter, Outfit) to ensure clean readability.
*   **Animations:** Implement subtle micro-animations (hover effects, state transitions) to make the application feel responsive and alive.

## Error Handling

*   **Graceful Failures:** The UI must handle API timeouts or limits gracefully, showing friendly error messages to the user.
*   **Input Validation:** Ensure prompts meet minimum requirements before making the API call.

## Coding Guidelines

*   **Language:** All source code, variable names, and comments must be written in English.
*   **Code Quality:** Keep components modular, focused, and maintainable. Use TypeScript for strict type safety.
