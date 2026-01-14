# Chatbot Feature Specification - Quiz Assistant

## Overview
Add an AI-powered chatbot assistant to the quiz interface that helps users understand questions and concepts during active quiz sessions. The chatbot uses Google Gemini API to provide contextual help based on the current question being viewed.

## Core Requirements

### 1. AI Provider
- **Service**: Google Gemini API
- **Model**: Use appropriate Gemini model (e.g., gemini-pro or gemini-1.5-flash)
- **API Key**: Store in environment variables (`.env.local`)
- **Error Handling**: Graceful degradation if API fails (show user-friendly error message)

### 2. UI Layout

#### Desktop View
- **Sidebar Panel**: Fixed right sidebar (30-40% width) alongside quiz content
- **Collapsible**: Toggle button to show/hide sidebar (preserves screen space)
- **Always Visible**: Chat appears during active quiz sessions only
- **Hidden States**: Not shown on quiz start screen or results screen

#### Mobile View
- **Full-Screen Modal**: Chat opens as overlay modal covering entire screen
- **Slide Animation**: Smooth slide-in from right or bottom
- **Close Button**: Prominent close button to return to quiz
- **Responsive**: Adapts to different mobile screen sizes

### 3. Context Management

#### Dynamic Context Injection
- **Question Change Detection**: Monitor `currentQuestion` state changes
- **Auto-Context Update**: When question changes, automatically inject new context into chat system
- **Context Includes**:
  - Current question text
  - All four answer options (A, B, C, D)
  - Question category
  - Section name (Health & Safety, Communication, Science)
  - Question ID (for reference)

#### System Prompt Structure
The system prompt should instruct Gemini to:
- Act as an educational tutor for 2365 Electrical Installation qualifications
- Help students understand concepts, terminology, and regulations
- Answer free-form questions about the current question
- Provide explanations, clarifications, and educational context
- Reference BS 7671 regulations and electrical standards when relevant
- Be helpful but maintain educational value

**Important**: The system prompt should NOT explicitly forbid revealing answers, as users may ask direct questions. However, it should encourage educational explanations.

#### Chat History Reset
- **Per-Question Reset**: Chat history clears when user navigates to a new question
- **Fresh Context**: Each question gets a clean chat session with new context
- **No Persistence**: Chat history does not persist across page refreshes or quiz restarts

### 4. Query Limitations

#### Rate Limiting
- **Limit**: 3 queries per question maximum
- **Counter Display**: Show remaining queries (e.g., "2 queries remaining")
- **Visual Feedback**: When limit reached, disable input and show message
- **Reset**: Counter resets when moving to next question
- **Counter State**: Track queries per question index (not global)

#### Implementation Notes
- Track query count per question index
- Store in state: `{ [questionIndex]: count }`
- Increment on each API call
- Reset when `currentQuestion` changes

### 5. User Experience

#### Chat Interface Components
- **Message List**: Scrollable container showing chat history
  - User messages: Right-aligned, distinct styling
  - AI responses: Left-aligned, distinct styling
  - Timestamps: Optional, subtle display
- **Input Field**: Text input at bottom of chat panel
  - Placeholder: "Ask about this question..."
  - Send button: Icon button or Enter key submission
  - Disabled state: When query limit reached or loading
- **Loading State**: 
  - Spinner/loading indicator while waiting for AI response
  - Disable input during loading
  - Show "Thinking..." or similar message

#### Response Display
- **Full Response**: Display complete AI response at once (no streaming)
- **Formatting**: Support markdown formatting for better readability
- **Code/Technical Terms**: Proper formatting for technical content
- **Links**: If AI provides references, make them clickable

#### Visual Design
- **Consistent Styling**: Match existing quiz app design system
- **Color Scheme**: Use indigo/blue theme consistent with quiz UI
- **Typography**: Readable font sizes, proper line spacing
- **Spacing**: Adequate padding and margins for readability

### 6. Technical Architecture

#### Component Structure
- **New Component**: `QuizChat.tsx` or `ChatAssistant.tsx`
- **Integration Point**: Add to `Quiz.tsx` component
- **Conditional Rendering**: Only show when `quizStarted === true` and `showResults === false`

#### State Management
- **Chat Messages**: Array of message objects `{ role: 'user' | 'assistant', content: string, timestamp?: Date }`
- **Query Count**: Object tracking queries per question `{ [questionIndex]: number }`
- **Loading State**: Boolean for API call in progress
- **Error State**: String or null for error messages

#### API Integration
- **Next.js API Route**: Create `/api/chat` endpoint
  - Accept POST requests with user message and question context
  - Call Gemini API with system prompt + context + user message
  - Return AI response
  - Handle errors gracefully
- **Client-Side**: Call API route from React component
  - Use `fetch` or axios
  - Handle loading states
  - Update chat messages state
  - Increment query counter

#### Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key
- Store securely, never commit to git
- Add to `.env.local` (already in `.gitignore`)

### 7. Error Handling

#### API Failures
- **Network Errors**: Show user-friendly message "Unable to connect to assistant. Please try again."
- **Rate Limit Errors**: Show message about API limits
- **Invalid API Key**: Log error, show generic error to user
- **Timeout**: Set reasonable timeout (e.g., 30 seconds), show timeout message

#### User Experience During Errors
- **Retry Option**: Allow user to retry failed requests
- **Error Messages**: Clear, non-technical language
- **Fallback**: Chat input remains functional after error (if under query limit)

### 8. Accessibility

#### Requirements
- **Keyboard Navigation**: Tab through chat interface, Enter to send
- **Screen Reader Support**: Proper ARIA labels for chat messages and input
- **Focus Management**: Focus moves appropriately when chat opens/closes
- **Color Contrast**: Meet WCAG AA standards for text readability

### 9. Performance Considerations

#### Optimization
- **Debouncing**: Prevent rapid-fire queries (optional, but query limit handles this)
- **Memoization**: Memoize context object to prevent unnecessary re-renders
- **Lazy Loading**: Consider lazy loading chat component until needed
- **API Caching**: No caching needed (each question needs fresh context)

### 10. Testing Considerations

#### Test Cases
- Chat appears/disappears correctly based on quiz state
- Context updates when question changes
- Query limit enforced (3 per question)
- Query counter resets on question change
- Chat history clears on question change
- API errors handled gracefully
- Mobile layout works correctly
- Loading states display properly
- Input disabled when limit reached

### 11. Future Enhancements (Not in Initial Implementation)

#### Potential Additions
- Analytics tracking for most-asked questions
- Chat history persistence across sessions
- Export chat conversations
- Pre-built hint suggestions
- Study mode vs test mode toggle
- Multiple language support
- Voice input/output

## Implementation Priority

### Phase 1 (MVP)
1. Basic sidebar chat UI
2. Gemini API integration
3. Context injection on question change
4. Query limit (3 per question)
5. Chat history reset per question

### Phase 2 (Polish)
1. Mobile responsive design
2. Enhanced error handling
3. Loading states and animations
4. Accessibility improvements

### Phase 3 (Future)
1. Analytics integration
2. Advanced features from enhancement list

## Notes for Developer

- Keep chat component modular and reusable
- Follow existing code patterns in the codebase
- Use TypeScript for type safety
- Maintain consistent styling with Tailwind CSS
- Test thoroughly on mobile devices
- Document API key setup in README
- Consider adding rate limiting on backend if needed for production






