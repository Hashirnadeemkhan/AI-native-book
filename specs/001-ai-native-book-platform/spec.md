# Feature Specification: Cybernetic HUD Documentation Platform

**Feature Branch**: `001-act-senior-technical`
**Created**: 2025-12-02
**Status**: Draft
**Input**: Feature Request #101 - Cybernetic HUD & RAG Architecture

## Product Intent

The "Cybernetic HUD Documentation Platform" aims to provide field Operators with an immersive, personalized, and AI-assisted experience for interacting with documentation related to Physical AI and Humanoid Robotics. The platform's aesthetic evokes a futuristic, industrial interface, ensuring a focused and theme-consistent user experience. The core intent is to empower Operators with quick access to relevant information, tailored to their specific needs and hardware, significantly enhancing their operational efficiency and comprehension.

## User Stories

### User Story 1 - System Link & Calibration (Priority: P1)

As an Operator, I want to securely link my system, and upon first connection, calibrate my profile with my hardware specifications and proficiencies, so that the platform can provide me with a personalized documentation experience.

**Why this priority**: This is the foundational onboarding experience and is critical for accessing personalized content and ensuring compliance. Without this, the primary value proposition of the platform is unachievable.

**Independent Test**: Can be fully tested by a new Operator successfully completing the GitHub/Better-Auth "System Link" and the subsequent "Calibration Modal," leading to their profile data being persisted and accessible.

**Acceptance Scenarios**:

1.  **Given** I am a new Operator, **When** I initiate a "System Link" via GitHub/Better-Auth, **Then** I am redirected to a "Calibration Modal."
2.  **Given** I am in the "Calibration Modal," **When** I input my Hardware Specs (e.g., "NVIDIA Jetson Orin"), Coding Proficiency, and AI Proficiency, **Then** this data is persisted to the `users` table in the `additional_info` JSONB column.
3.  **Given** I have completed "Calibration," **When** I navigate the platform, **Then** my "System Link" toggle in the navbar shows "Online (Auth)" with a Green/Cyan visual state.
4.  **Given** I am an Operator, **When** I click the "Power Switch" toggle to "Sever Connection," **Then** my session is terminated, and the toggle shows "Offline (Guest)" with a Red/Grey visual state.

---

### User Story 2 - Lesson Matrix Multi-View Access (Priority: P1)

As an Operator, I want to access documentation pages with multiple views ("Original", "Summarize", "Personalized", "Urdu Uplink"), so that I can consume information in a format best suited to my current needs and preferences.

**Why this priority**: This directly addresses the core multi-view documentation experience, which is a key feature for information consumption and personalization.

**Independent Test**: Can be fully tested by an authenticated Operator navigating to any documentation page and successfully switching between the "Original", "Summarize", "Personalized", and "Urdu Uplink" tabs, with content rendering as expected for each.

**Acceptance Scenarios**:

1.  **Given** I am an authenticated Operator viewing a documentation page, **When** I select the "Summarize" tab, **Then** I see a bullet-point extraction of the content (via `lesson-summarizer` Skill).
2.  **Given** I am an authenticated Operator viewing a documentation page, **When** I select the "Personalized" tab, **Then** I see content rewritten specifically matching my "Calibration Data" (via `content-personalizer` Skill), explicitly referencing my specific hardware (e.g., CUDA headers for RTX 3060).
3.  **Given** I am an authenticated Operator viewing a documentation page, **When** I select the "Urdu Uplink" tab, **Then** I see a full text translation of the content (via `urdu-translator` Skill).
4.  **Given** I am an unauthenticated Guest viewing a documentation page, **When** I click on the "Summarize", "Personalized", or "Urdu Uplink" tabs, **Then** a "Security Clearance Required" overlay is triggered, preventing access.

---

### User Story 3 - Drone RAG Assistant Interaction (Priority: P2)

As an Operator, I want to interact with a persistent "Support Drone" RAG assistant for quick Q&A, and to "Scan with Drone" specific text segments for contextual queries, so that I can rapidly get answers and deepen my understanding of the documentation.

**Why this priority**: Provides an intelligent support layer to the documentation, enhancing usability and knowledge retrieval. While important, it is secondary to the core documentation views and calibration.

**Independent Test**: Can be fully tested by an Operator asking a question to the floating "Support Drone" widget and receiving a relevant answer, and by highlighting text, right-clicking, and selecting "Scan with Drone" to query the highlighted segment, also receiving a relevant answer.

**Acceptance Scenarios**:

1.  **Given** I am an Operator viewing any page, **When** I ask a question to the persistent floating "Support Drone" widget, **Then** I receive a relevant RAG-generated answer.
2.  **Given** I am an Operator viewing a documentation page, **When** I highlight a section of text and right-click, **Then** I see a context menu option "Scan with Drone."
3.  **Given** I have highlighted text and selected "Scan with Drone," **When** the "Support Drone" processes my query, **Then** I receive a contextual answer related to the highlighted segment.

---

### Edge Cases

- What happens when a "lesson-summarizer," "content-personalizer," or "urdu-translator" skill fails to generate content? The system should display a user-friendly error message within the tab and fall back to the "Original" view if possible.
- How does the system handle "Calibration Data" inconsistencies or missing values? The system should prompt the Operator to re-calibrate or provide default values for personalization until complete data is available.
- What if the "Support Drone" returns irrelevant or nonsensical answers? The system should offer an option to provide feedback on the answer quality and ideally log these instances for review and model improvement.

## Technical Architecture

### Database Schema Definitions

**Table: `users`**
- `id`: UUID (Primary Key)
- `tenant_id`: UUID (Required for RLS)
- `github_id`: VARCHAR (Unique, for Better-Auth integration)
- `email`: VARCHAR (Unique, indexed)
- `display_name`: VARCHAR
- `additional_info`: JSONB (Stores Hardware Specs, Coding Proficiency, AI Proficiency)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

**Table: `lessons`**
- `id`: UUID (Primary Key)
- `tenant_id`: UUID (Required for RLS)
- `title`: VARCHAR
- `original_content`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

**Table: `summaries`**
- `id`: UUID (Primary Key)
- `lesson_id`: UUID (Foreign Key to `lessons.id`)
- `content`: TEXT
- `created_at`: TIMESTAMP

**Table: `personalized_content`**
- `id`: UUID (Primary Key)
- `tenant_id`: UUID (Required for RLS)
- `user_id`: UUID (Foreign Key to `users.id`)
- `lesson_id`: UUID (Foreign Key to `lessons.id`)
- `content`: TEXT (Personalized documentation content)
- `calibration_snapshot`: JSONB (Snapshot of user's `additional_info` at content generation time)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Stack
- **Frontend**: Docusaurus v3, Tailwind CSS v3
- **Authentication**: Better-Auth (GitHub Provider)
- **Database**: Neon Serverless Postgres
- **Backend API**: FastAPI
- **AI/RAG**: Qdrant (Vector DB) + OpenAI Agents
- **AI Logic**: Reusable Skills defined in `.claude/skills/`

### Database Schema Standards

- **DBS-001**: All tables MUST include `tenant_id` for Row-Level Security (RLS).
- **DBS-002**: The `users` table MUST use JSONB for flexible profile data (e.g., Hardware Specs, AI Proficiency).
- **DBS-003**: The application logic MUST check for the existence of records in the `personalized_content` or `summaries` table to determine if personalized or summarized content has been generated for a given lesson and user.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The "Personalized" tab content MUST explicitly reference the Operator's specific hardware (e.g., "RTX 3060" -> CUDA headers in code examples) with 100% accuracy.
- **SC-002**: "Support Drone" responses and all "Lesson Matrix" tab generations (Summarize, Personalized, Urdu Uplink) MUST render within 3 seconds for 95% of requests.
- **SC-003**: Row Level Security (RLS) enforcement MUST ensure Operators strictly NEVER access another Operator's personalized data rows, validated through security audits and automated tests (0 unauthorized access incidents).
- **SC-004**: The "Calibration" onboarding flow MUST maintain a 0% drop-off rate, meaning all Operators successfully complete their calibration before accessing core platform functionalities.

## User Scenarios

### Onboarding Flow: First "System Link" & "Calibration"

1.  **Operator Access**: A new Operator attempts to access the Cybernetic HUD Documentation Platform.
2.  **System Link Prompt**: The platform presents a prominent "System Link" (login) option, leveraging GitHub/Better-Auth.
3.  **Authentication**: The Operator completes the GitHub/Better-Auth flow.
4.  **Navigation Interception**: Upon successful authentication, the system intercepts navigation to any core content, immediately presenting the "Calibration Modal."
5.  **Calibration Data Input**: The Operator is guided through inputting their Hardware Specs (e.g., "NVIDIA Jetson Orin", "RTX 4090"), Coding Proficiency (e.g., "Intermediate Python"), and AI Proficiency (e.g., "Familiar with LLMs").
6.  **Data Persistence**: The entered "Calibration Data" is securely stored in the `additional_info` JSONB column of the `users` table, associated with their `tenant_id`.
7.  **Calibration Completion**: Upon successful data submission, the modal closes, and the Operator gains full access to the platform, with their "System Link" toggle now indicating "System Active" (Green/Cyan).
8.  **Compliance Enforcement**: The platform remains unusable until this calibration is complete, ensuring the 0% drop-off rate for this critical flow.

### Context Menu Usage: "Scan with Drone"

1.  **Operator Browsing**: An authenticated Operator is viewing a documentation page within the "Lesson Matrix."
2.  **Text Highlighting**: The Operator encounters a specific technical term or code snippet they wish to understand in more detail and highlights the relevant text.
3.  **Context Menu Activation**: The Operator right-clicks on the highlighted text.
4.  **"Scan with Drone" Option**: A context menu appears, including the option "Scan with Drone."
5.  **Query Initiation**: The Operator selects "Scan with Drone."
6.  **Drone Processing**: The highlighted text segment is sent as a query to the "Support Drone" RAG Assistant.
7.  **Contextual Response**: The "Support Drone" processes the query using Qdrant and OpenAI Agents, and a contextual answer or explanation is displayed to the Operator, potentially within a temporary overlay or within the floating drone widget.

## Non-Goals

-   No "Light Mode" support; the platform will exclusively feature a dark mode interface to maintain thematic consistency.
-   No payment gateway or subscription logic will be implemented; access to features is determined solely by authentication and calibration.
-   No native mobile applications will be developed; the platform will be a responsive web application.
-   No user-to-user communication features (e.g., forums, chat) will be included.
