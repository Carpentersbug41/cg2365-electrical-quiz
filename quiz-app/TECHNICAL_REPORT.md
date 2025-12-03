
# 2365 Electrical Quiz Platform - Technical & Functional Report

## 1. Executive Summary
The **2365 Quiz Platform** is a modern, interactive web application designed to assist students preparing for the **City & Guilds 2365 Electrical Installation** assessments. Unlike traditional static revision methods, this application utilizes gamification, instant feedback loops, and modern web technologies to create an engaging learning environment. It supports multiple modules—Health & Safety, Communication, and Science—providing a comprehensive revision tool for Level 2 and Level 3 candidates.

## 2. Purpose & Target Audience
### Purpose
The primary goal of this software is to transform the revision process from a passive activity into an active, engaging "game." By introducing immediate auditory and visual feedback, the application leverages dopamine-driven loops (similar to apps like Duolingo) to increase retention and study duration.

### Target Audience
*   **Primary Users:** Students undertaking the City & Guilds 2365 Level 2 & 3 Electrical Installation Diplomas.
*   **Secondary Users:** Lecturers and training providers looking for supplementary revision tools for their cohorts.

### Learning Objectives
*   Reinforce core theoretical knowledge required for the 201/601 (Health & Safety), 202 (Science), and 210 (Communication) exams.
*   Improve recall speed through timed, rapid-fire questioning.
*   Identify knowledge gaps via the post-quiz review system.

## 3. Functional Overview (User Journey)

### 3.1 Topic Selection
Upon launching the application, users are presented with a dashboard to select their specific area of study:
*   **Health & Safety (Level 2 & 3)**
*   **Communication (Level 2)**
*   **Science (Level 2)**
*   *Dynamic Question Counts:* The dashboard updates in real-time to show the total number of questions available in the database for each category.

### 3.2 Quiz Configuration
Users are not forced into a "one size fits all" test. They can customize their session length based on available time:
*   **Micro-learning:** 5 or 10 questions for quick revision.
*   **Deep Dive:** 20, 30, or 50 questions for exam simulation.

### 3.3 The Gameplay Loop
The core experience is designed to feel like a game rather than a test:
*   **Streak System:** A "Fire" (🔥) counter tracks consecutive correct answers. Building a streak multiplies the points earned, encouraging careful thought.
*   **Visual Feedback:**
    *   **Correct:** Green flash, checkmark animation, and floating score bubbles.
    *   **Incorrect:** Screen shake effect and red flash to provide visceral "error" feedback.
    *   **Milestones:** Confetti explosions trigger at high streaks (every 5 correct) and upon perfect quiz completion.
*   **Audio Feedback:**
    *   Satisfying "pings" for correct answers.
    *   Rising pitch and harmonious chords for streak milestones.
    *   Low-frequency buzz for errors.
    *   Victory fanfare sequences for high scores.

### 3.4 Review & Analytics
At the end of a session, the user receives a comprehensive breakdown:
*   **Scoreboard:** Displays final score, percentage, and total "Gamified Points."
*   **Performance Message:** Dynamic feedback text based on the percentage (e.g., "Excellent," "Keep Studying").
*   **Detailed Review:** A filtered list of incorrect answers, showing:
    *   The user's wrong choice.
    *   The correct answer.
    *   The specific category of the question (e.g., "Ohm's Law" or "PPE").

## 4. Technical Architecture

### 4.1 Technology Stack
*   **Framework:** Next.js 15 (App Router) & React 19.
*   **Language:** TypeScript (Strict Mode) for type safety and code reliability.
*   **Styling:** Tailwind CSS 4 for responsive, utility-first design.
*   **State Management:** React Hooks (`useState`, `useEffect`) for local session management.
*   **Audio Engine:** Native Web Audio API (Oscillators & Gain Nodes) for generating sound effects without requiring external asset downloads.
*   **Animation:** CSS Keyframes (for shakes/flashes) and `canvas-confetti` library for particle effects.

### 4.2 Data Structure
Questions are stored in optimized, static TypeScript arrays to ensure zero-latency loading.
**Schema Example:**
```typescript
interface Question {
  id: number;
  question: string; // The prompt
  options: string[]; // Array of 4 potential answers
  correctAnswer: number; // Index of the correct option (0-3)
  category: string; // Sub-topic (e.g., "Ohm's Law")
  section: string; // Major Module (e.g., "Science")
}
```

### 4.3 Algorithm Logic
*   **Randomization:** The `getRandomQuestions` function utilizes the Fisher-Yates shuffle algorithm to ensure that neither the questions nor the *order of the answers* is predictable. This prevents users from memorizing "Option A" and forces them to learn the content.
*   **Scoring Algorithm:** `Base Score (100) + (Streak * 10)`. This rewards consistency over luck.

## 5. Future Roadmap
*   **Persistence:** Implementation of `localStorage` to save user Level/Rank (e.g., "Apprentice" to "Master Electrician") across sessions.
*   **Spaced Repetition:** An algorithm to prioritize questions the user has previously answered incorrectly.
*   **PWA Support:** Making the app installable on mobile devices for offline revision.

