# Implementation Questions — Learning Module MVP
**Project:** C&G 2365 Level 2 — Unit 202 Electrical Science  
**Purpose:** Clarify implementation scope before development begins  
**Date:** 2026-01-13

---

## Context
We're building a web-based learning system with:
- Structured course pages (three layout templates: A, B, C)
- Embedded AI tutor (Teach/Check/Fix modes)
- Evidence-based learning methods (worked examples, retrieval practice, spaced review)
- RAG-based grounding to lesson content

Before implementation, we need to clarify the following:

---

## Question 1: Primary Scope
**What is the primary scope for this implementation phase?**

Please select one:

- [ ] **Option A:** Build one complete lesson page (e.g., Series Circuits with Layout A or B) with embedded tutor
- [ ] **Option B:** Implement the three layout template system as reusable React components (without full content yet)
- [ ] **Option C:** Build the AI tutor foundation (modes, RAG integration, system prompts)
- [ ] **Option D:** Complete MVP slice: lesson page(s) + quiz (Layout C) + tutor with all modes + progress tracking

**Selected:**  
**Additional notes:**

---

## Question 2: Lesson Topic
**Which lesson topic should be implemented first?**

Please select one:

- [ ] **202.4A — Series circuits:** rules (I, V, R), calculations, why they're true (uses Layout A: Split-Vis)
- [ ] **Parallel circuits:** rules, calculations, discrimination practice
- [ ] **Ohm's Law:** V = I × R, rearranging, basic calculations (uses Layout B: Linear Flow)
- [ ] **Other topic:** (please specify below)

**Selected:**  
**Additional notes:**

---

## Question 3: AI Tutor Integration Level
**What level of AI tutor integration should be implemented?**

Please select one:

- [ ] **Mock/placeholder tutor:** UI components only, hardcoded responses for testing the layout and flow
- [ ] **Basic LLM integration:** Mode switching (Teach/Check/Fix) with OpenAI/Anthropic API, but no RAG yet
- [ ] **Full RAG implementation:** Complete system with lesson content retrieval, vector embeddings, and all modes

**Selected:**  
**If LLM integration, which API:** (OpenAI GPT-4, Claude, other?)  
**Additional notes:**

---

## Question 4: Relationship to Existing Code
**How should this relate to the existing quiz-app code?**

Please select one:

- [ ] **Separate module:** Create new learning pages as a separate section alongside existing quiz functionality
- [ ] **Replace quiz:** Evolve/replace existing quiz functionality with the new structured approach
- [ ] **Integration:** Keep existing quiz and add new learning pages that connect to it (e.g., quiz becomes Layout C for lessons)

**Selected:**  
**Additional notes:**

---

## Question 5: Content Management
**How should lesson content be managed initially?**

Please select one:

- [ ] **Hardcoded:** Lesson content lives in TypeScript/TSX files as structured data (fastest for MVP)
- [ ] **JSON files:** Lesson content in JSON/Markdown files that are imported
- [ ] **CMS/Database:** Build a content management system or use a database for lessons
- [ ] **Hybrid:** Hardcoded structure, but content easily extractable to JSON later

**Selected:**  
**Additional notes:**

---

## Question 6: Tutor Modes
**Which tutor modes should be implemented in this phase?**

Please select all that apply:

- [ ] **Teach (Coach):** Supportive, step-by-step, scaffolded help
- [ ] **Check (Assessor):** Strict marking, minimal help during attempts
- [ ] **Fix (Remediate):** Target specific misunderstandings + immediate retest
- [ ] **All three modes** (full MVP behaviour set)

**Selected:**  
**Additional notes:**

---

## Question 7: Question Bank Integration
**How should practice questions and assessment be handled?**

- [ ] **Reuse existing questions:** Adapt questions from `healthAndSafetyQuestions.ts`, `scienceQuestions.ts`
- [ ] **Create new question bank:** Build new question structure aligned with lesson outcomes and tagging
- [ ] **Both:** Restructure existing questions to fit new system

**Selected:**  
**Additional notes:**

---

## Question 8: Progress Tracking
**What level of progress tracking is needed for MVP?**

- [ ] **None yet:** Focus on lesson/tutor experience first
- [ ] **Basic:** Track completion, quiz attempts, pass/fail (localStorage or simple state)
- [ ] **Intermediate:** Add spaced review scheduling, mastery gates
- [ ] **Full:** Complete progress system with delayed re-checks, analytics

**Selected:**  
**Additional notes:**

---

## Question 9: Testing Strategy
**Should we implement the Golden Set QA approach from the start?**

- [ ] **Yes:** Build 15-20 test scenarios for tutor behaviour validation
- [ ] **Later:** Focus on functional testing first, add Golden Set after core is working
- [ ] **Manual only:** Manual testing for MVP

**Selected:**  
**Additional notes:**

---

## Additional Context / Constraints

**Any other requirements, constraints, or preferences:**





---

## Next Steps
Once these questions are answered:
1. Developer will create a detailed implementation plan
2. Plan will include: file structure, component architecture, data flow, and step-by-step tasks
3. Implementation can begin with clear requirements

---

**To be completed by:** [Name/Role]  
**Return to developer by:** [Date]

