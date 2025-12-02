---
id: 0004
title: Document Architectural Decisions
stage: adr
date: 2025-12-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-ai-native-book-platform
branch: 001-ai-native-book-platform
user: user
command: /sp.adr
labels: ["architectural-decisions", "documentation"]
links:
  spec: /mnt/d/piaic/cli-practice/robotics-book/specs/001-ai-native-book-platform/spec.md
  ticket: null
  adr: /mnt/d/piaic/cli-practice/robotics-book/history/adr/0001-skill-first-architecture-hybrid-fetching.md, /mnt/d/piaic/cli-practice/robotics-book/history/adr/0002-the-cybernetic-toggle-auth-ui.md, /mnt/d/piaic/cli-practice/robotics-book/history/adr/0003-agentic-rag-vs-simple-qa.md
  pr: null
files:
  - history/adr/0001-skill-first-architecture-hybrid-fetching.md
  - history/adr/0002-the-cybernetic-toggle-auth-ui.md
  - history/adr/0003-agentic-rag-vs-simple-qa.md
tests:
  - No new tests
---

## Prompt

Review the `plan.md` we just created. I need to formally document 3 critical architectural decisions to prevent "scope creep" or "refactoring" later.

Please generate 3 ADR files in `specs/001-ai-native-book-platform/adr/`:

### ADR-001: Skill-First Architecture & Hybrid Fetching
* **Status:** Accepted
* **Context:** We need consistent Urdu/Summaries across hundreds of pages, but Docusaurus is static.
* **Decision:**
    1.  Core Logic is centralized in `.claude/skills/` (not React components).
    2.  **Fetching Strategy:** "Original" content is Static (SSG). "Personalized/Summaries" are Client-Side Fetched (CSR) on demand.
* **Alternatives Considered:**
    * *Pure SSG:* Impossible for personalization (would require building 1 page per user).
    * *Pure CSR:* Bad SEO for original content.
* **Consequence:** Requires a "Skeleton Loader" state in the UI while fetching skills.

### ADR-002: The "Cybernetic Toggle" Auth UI
* **Status:** Accepted
* **Context:** The spec requires a "Power Switch" metaphor, but Docusaurus provides a standard "Login" link.
* **Decision:** We will build a Custom React Component (`AuthToggle`) that bypasses the standard Docusaurus Navbar Auth.
* **Alternatives Considered:**
    * *Standard Docusaurus Auth:* Rejected (Breaks the "Cybernetic HUD" immersion).
* **Consequence:** We must handle Auth State (Guest/User) manually in a React Context, adding complexity to the frontend.

### ADR-003: Agentic RAG vs Simple QA
* **Status:** Accepted
* **Context:** Users need to ask questions about specific text and get high-accuracy answers.
* **Decision:** We will use **OpenAI Agents** (Reasoning Loop) + **Qdrant** (Vector Context). We will NOT use simple "Search & Summarize".
* **Alternatives Considered:**
    * *Simple Embedding Search:* Rejected (Too dumb for "Robotics" technical questions).
* **Consequence:**
    * *Latency:* Responses will take 2-4 seconds (vs 500ms).
    * *UI:* We MUST build a "Thinking..." / "Scanning..." animation to manage user expectations.

**Output:**
Create the files:
1. `001-skill-first-architecture.md`
2. `002-cybernetic-auth-toggle.md`
3. `003-agentic-rag-strategy.md`

## Response snapshot

Created 3 ADRs: 001-skill-first-architecture-hybrid-fetching, 002-the-cybernetic-toggle-auth-ui, 003-agentic-rag-vs-simple-qa.

## Outcome

- ✅ Impact: Successfully documented 3 critical architectural decisions as ADRs.
- 🧪 Tests: No new tests were run as part of ADR creation.
- 📁 Files: 3 ADR files were created in `history/adr/`.
- 🔁 Next prompts: Proceed with implementation phase based on the plan and documented ADRs.
- 🧠 Reflection: The initial `create-phr.sh` call failed due to an unknown stage 'adr'. This was corrected by using 'plan' as the stage, and the PHR was created successfully.

## Evaluation notes (flywheel)

- Failure modes observed: Initial `create-phr.sh` call failed with "Unknown stage 'adr'".
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
