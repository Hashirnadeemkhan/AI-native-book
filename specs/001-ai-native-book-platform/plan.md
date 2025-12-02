# Implementation Plan: AI Native Book Platform

## 1. Scope and Dependencies

### In Scope:
*   Secure user authentication via Better-Auth (GitHub).
*   User profile calibration with hardware and AI proficiency.
*   Personalized and summarized lesson content views.
*   Urdu translation view for lesson content.
*   "Support Drone" RAG assistant for Q&A and contextual scanning.
*   Multi-tenancy enforcement via Neon DB Row-Level Security (`tenant_id`).
*   Database schema for `users`, `lessons`, `summaries`, `personalized_content`.
*   FastAPI backend for API endpoints.
*   Docusaurus v3 frontend with Tailwind CSS v3.
*   AI Skills: `urdu-translator`, `lesson-summarizer`, `content-personalizer`.
*   Qdrant and OpenAI Agents for RAG.

### Out of Scope:
*   Light mode support.
*   Payment gateway or subscription logic.
*   Native mobile applications.
*   User-to-user communication features.

### External Dependencies:
*   **Neon Serverless Postgres:** Database hosting and management.
*   **GitHub:** OAuth provider for Better-Auth.
*   **Qdrant Cloud:** Vector database for RAG.
*   **OpenAI API:** For AI model inference via OpenAI Agents SDK.
*   **Better-Auth:** Authentication library.
*   **Docusaurus v3:** Frontend framework.
*   **Tailwind CSS v3:** CSS framework.

## 2. Key Decisions and Rationale

### Decision: Skill-First Development Pattern
*   **Options Considered:** UI-first, Monolithic.
*   **Trade-offs:**
    *   **Skill-First:** Pros: Reusable AI logic, easier testing of intelligence, clear separation of concerns. Cons: UI development might feel blocked initially.
    *   **UI-First:** Pros: Rapid UI prototyping. Cons: AI logic can become tightly coupled, difficult to test, less reusable.
    *   **Monolithic:** Pros: Simpler deployment initially. Cons: High coupling, difficult to scale and maintain.
*   **Rationale:** Aligns with the "AI-Native Design" pillar of the constitution, ensuring modularity, reusability, and maintainability of AI functionalities. Prioritizes the core intelligence of the platform.
*   **Principles:** Measurable (skill performance), Reversible (can integrate UI later), Smallest viable change (focus on skills first).

### Decision: Client-Side Fetching vs. Static Generation for Lesson Content
*   **Options Considered:** Pure Static Generation, Pure Client-Side Rendering, Hybrid.
*   **Trade-offs:**
    *   **Client-Side Fetching (Personalized/Summarize):** Pros: Highly dynamic, user-specific content, real-time updates. Cons: Initial load time can be longer, increased server load for dynamic generation.
    *   **Static Generation (Original):** Pros: Excellent performance, SEO-friendly, low server load. Cons: Cannot serve dynamic, user-specific content directly.
    *   **Hybrid:** Combines benefits but adds complexity.
*   **Rationale:** "Personalized" and "Summarize" tabs are inherently user-specific and dynamic, requiring client-side fetching to ensure relevance to the Operator's calibration data. The "Original" tab is static and benefits from the performance of static generation. This aligns with the "Performance Baselines" and "User Experience" principles.
*   **Principles:** Measurable (page load times), Reversible (can adjust fetching strategy), Smallest viable change (apply optimal strategy per content type).

## 3. Interfaces and API Contracts

### Public APIs:
*   **Authentication Endpoints:**
    *   `/auth/login/github`: Initiates GitHub OAuth flow.
    *   `/auth/callback/github`: Handles GitHub OAuth callback.
    *   `/auth/logout`: Terminates user session.
    *   `/users/me`: Retrieves current authenticated user's profile.
*   **User Management Endpoints:**
    *   `/users/calibrate`: POST endpoint for submitting calibration data (Hardware Specs, AI Proficiency).
*   **Lesson Content Endpoints:**
    *   `/lessons/{lesson_id}`: GET original lesson content.
    *   `/lessons/{lesson_id}/summarize`: POST to trigger summary generation, GET summary.
    *   `/lessons/{lesson_id}/personalize`: POST to trigger personalization, GET personalized content.
    *   `/lessons/{lesson_id}/urdu`: POST to trigger Urdu translation, GET Urdu content.
*   **RAG Endpoints:**
    *   `/drone/chat`: POST for general RAG Q&A.
    *   `/drone/scan`: POST for contextual scanning of highlighted text.

### Versioning Strategy:
*   API versioning via URL prefix (e.g., `/api/v1/...`).

### Idempotency, Timeouts, Retries:
*   All `POST` endpoints creating resources should be designed for idempotency where applicable.
*   API gateways or clients will implement appropriate timeouts and retry mechanisms for AI skill calls.

### Error Taxonomy with status codes:
*   `400 Bad Request`: Invalid input, missing parameters.
*   `401 Unauthorized`: Authentication required or failed.
*   `403 Forbidden`: Insufficient permissions (e.g., RLS violation, unauthenticated access to premium feature).
*   `404 Not Found`: Resource not found.
*   `429 Too Many Requests`: Rate limiting.
*   `500 Internal Server Error`: Generic server error.
*   `503 Service Unavailable`: External service (e.g., AI Skill) temporarily unavailable.

## 4. Non-Functional Requirements (NFRs) and Budgets

*   **Performance:**
    *   P95 latency for API responses (excluding initial AI skill cold start) < 500ms.
    *   P95 latency for AI skill generations (Summarize, Personalize, Urdu) < 3 seconds.
    *   Throughput: Support 100 concurrent users without degradation.
    *   Resource Caps: Optimize FastAPI and Docusaurus for efficient memory and CPU usage.
*   **Reliability:**
    *   SLOs: 99.9% API Uptime, 99% AI Skill availability.
    *   Error Budgets: Defined for each service, monitored via observability tools.
    *   Degradation Strategy: Fallback to "Original" view if AI skill fails; graceful error messages.
*   **Security:**
    *   AuthN/AuthZ: Better-Auth for authentication, RLS for authorization (`tenant_id`).
    *   Data Handling: Encrypt sensitive data at rest and in transit.
    *   Secrets: Managed via environment variables and secure secrets management.
    *   Auditing: Log all critical security events (login, data modification, RLS violations).
*   **Cost:** Optimize Neon DB usage, Qdrant indexing, and OpenAI API calls to stay within budget.

## 5. Data Management and Migration

*   **Source of Truth:** Neon Serverless Postgres for all application data.
*   **Schema Evolution:** Use Alembic (FastAPI) or similar for database migrations.
*   **Migration and Rollback:** Clearly defined migration scripts; rollback procedures for database changes.
*   **Data Retention:** Policy for user data, lesson content, and generated AI content.

## 6. Operational Readiness

*   **Observability:**
    *   Logs: Centralized logging for all services (FastAPI, Docusaurus, AI Skills).
    *   Metrics: Collect Prometheus-compatible metrics for API performance, database queries, and AI skill usage.
    *   Traces: Distributed tracing for request flows across services.
*   **Alerting:** Thresholds for error rates, latency, and resource utilization. On-call owners for each component.
*   **Runbooks:** For common issues (e.g., DB connection failures, AI skill timeouts, auth errors).
*   **Deployment and Rollback strategies:** Automated CI/CD pipelines for deployment; blue/green or canary deployments. Rollback to previous stable version if issues detected.
*   **Feature Flags and compatibility:** Use feature flags for new features to enable phased rollouts and easy toggling.

## 7. Risk Analysis and Mitigation

*   **Risk 1: AI Skill Failures/Latency:**
    *   **Blast Radius:** Degraded user experience for Summarize/Personalize/Urdu tabs.
    *   **Mitigation:** Fallback to "Original" content, display user-friendly error messages, implement retries with backoff, monitor AI skill performance (SC-002).
    *   **Kill Switches/Guardrails:** Circuit breakers for AI skill calls; ability to disable specific skills if problematic.
*   **Risk 2: RLS Misconfiguration/Bypass:**
    *   **Blast Radius:** Unauthorized access to sensitive user data.
    *   **Mitigation:** Rigorous security audits, automated RLS tests (SC-003), least privilege principle for database roles.
    *   **Kill Switches/Guardrails:** Immediate database access revocation if RLS breach detected.
*   **Risk 3: Performance Degradation with Scale:**
    *   **Blast Radius:** Slow user experience, increased infrastructure costs.
    *   **Mitigation:** Performance testing against baselines, caching strategies, database query optimization, horizontal scaling of FastAPI and AI skill services.
    *   **Kill Switches/Guardrails:** Auto-scaling groups, rate limiting at API gateway.

## 8. Evaluation and Validation

*   **Definition of Done:**
    *   All user stories implemented with acceptance criteria met.
    *   Comprehensive automated test coverage (unit, integration, E2E).
    *   Security audits passed (RLS, AuthN/AuthZ).
    *   Performance baselines met (SC-002).
    *   Code reviewed by at least two peers.
    *   ADRs documented for key decisions.
*   **Output Validation:**
    *   **SC-001 Validation:** Automated tests for personalized content to ensure explicit hardware references.
    *   **SC-003 Validation:** Automated security tests to verify RLS enforcement.
    *   **SC-004 Validation:** Analytics to track calibration drop-off rate (target 0%).

## 9. Architectural Decision Record (ADR)

*   📋 Architectural decision detected: Auth State Management (LocalStorage + Context for Toggle) — Document reasoning and tradeoffs? Run `/sp.adr Auth State Toggle: LocalStorage + Context Rationale`
*   📋 Architectural decision detected: Data Fetching Strategy (Client-Side vs Static Generation) — Document reasoning and tradeoffs? Run `/sp.adr Data Fetching Strategy: Client-Side vs Static Generation`

## 10. Execution Roadmap (Strict Sequence)

### Phase 1: The Intelligence Layer (Skills First)
*   **Goal:** Build the "Brain" before the Body.
*   **Deliverables:**
    1.  `urdu-translator` Skill (verified via CLI).
    2.  `lesson-summarizer` Skill (verified via CLI).
    3.  `content-personalizer` Skill (verified via CLI).
*   **Validation:** All 3 skills must return valid text output from a CLI prompt before Phase 2 begins.

### Phase 2: The Core Systems (Backend & Auth)
*   **Goal:** Build the "Spine" (Data & Security).
*   **Deliverables:**
    1.  Neon DB setup with `tenant_id` RLS policies.
    2.  FastAPI CRUD endpoints for `users` (with JSONB profile).
    3.  Better-Auth implementation with GitHub Provider.
    4.  **Critical:** The "Sign-In Toggle" logic (Backend state).

### Phase 3: The Cybernetic Frontend (UI)
*   **Goal:** Build the "Face" (HUD Interface).
*   **Deliverables:**
    1.  Docusaurus v3 + Tailwind v3 installation.
    2.  `AuthToggle.tsx` component (Red/Green states).
    3.  `LessonMatrix.tsx` component (The 4-Tab interface).
    4.  Logic to Lock specific tabs for Guests.

### Phase 4: The Drone Integration (RAG)
*   **Goal:** Build the "Assistant".
*   **Deliverables:**
    1.  Qdrant Vector DB indexing script.
    2.  OpenAI Agent setup.
    3.  `DroneWidget.tsx` floating component.
    4.  Context Menu "Scan" implementation.
