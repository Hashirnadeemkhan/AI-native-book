---
id: 0003
title: Generate AI Native Book Platform Plan
stage: plan
date: 2025-12-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-ai-native-book-platform
branch: 001-ai-native-book-platform
user: user
command: /sp.plan
labels: ["planning", "feature-development"]
links:
  spec: /mnt/d/piaic/cli-practice/robotics-book/specs/001-ai-native-book-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-ai-native-book-platform/plan.md
tests:
  - No new tests
---

## Prompt

My specification is at `D:\piaic\cli-practice\robotics-book\specs\001-ai-native-book-platform\spec.md`.
My constitution is at `D:\piaic\cli-practice\robotics-book\.specify\memory\constitution.md`.

I need a concrete, executable Implementation Plan.
**STRICT CONSTRAINT: NO MOCK DATA.**
* Do not plan for "dummy JSON" files.
* The plan must implement real database connections, real authentication flows, and real AI API calls from Day 1.

### 1. Architecture Strategy
* **Pattern:** "Skill-First Development". We must build the AI Skills (Urdu, Summarizer) *before* we build the UI that consumes them.
* **Directory Match:** STRICTLY follow the structure in `CLAUDE.md`:
    * `api/` (FastAPI)
    * `docusaurus/` or root (Frontend)
    * `.claude/skills/` (Intelligence)

### 2. Required Implementation Phases
Break the work into these exact phases:

* **Phase 1: The Intelligence Layer (Skills)**
    * Create `urdu-translator`, `lesson-summarizer`, `content-personalizer`.
    * Test them with CLI prompts to ensure they follow "Robotics" tone.

* **Phase 2: The Core Systems (Backend & Auth)**
    * Setup Neon DB with `tenant_id` RLS.
    * Implement `users` table with JSONB `additional_info`.
    * Setup Better-Auth (GitHub) and the "Sign-In Toggle" logic.

* **Phase 3: The Cybernetic Frontend (UI)**
    * Install Docusaurus & Tailwind v3.
    * Build `AuthToggle.tsx` (The "Power Switch").
    * Build the `LessonMatrix.tsx` (<Tabs> wrapper with Lock Screen logic).

* **Phase 4: The Drone Integration (RAG)**
    * Setup Qdrant & OpenAI Agent.
    * Build `DroneWidget.tsx`.
    * Implement "Context Menu" scan logic.

### 3. Key Decisions (ADRs) to Document
* **Auth State:** Why we use LocalStorage + Context for the "Toggle" state (Speed vs Security).
* **Data Fetching Strategy:** Explicitly document the decision to use **Client-Side Fetching** for the "Personalized" and "Summarize"
tabs (since they are user-specific) vs **Static Generation** for the "Original" tab.

**Output:**
Generate the full `D:\piaic\cli-practice\robotics-book\specs\001-ai-native-book-platform/plan.md` file.

## Response snapshot

Generated the implementation plan at `specs/001-ai-native-book-platform/plan.md` based on the provided requirements.

## Outcome

- ✅ Impact: Generated a comprehensive implementation plan for the AI Native Book Platform, detailing architecture, phases, and key decisions.
- 🧪 Tests: No new tests were run or generated in this planning phase.
- 📁 Files: specs/001-act-senior-technical/plan.md was created/updated.
- 🔁 Next prompts: Continue with implementation tasks based on the plan, or run ADR commands for documented decisions.
- 🧠 Reflection: The initial `setup-plan.sh` failed due to multiple spec directories with the same prefix. This was resolved by the user, and the plan was successfully generated on the second attempt.

## Evaluation notes (flywheel)

- Failure modes observed: `setup-plan.sh` failed due to conflicting spec directories.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
