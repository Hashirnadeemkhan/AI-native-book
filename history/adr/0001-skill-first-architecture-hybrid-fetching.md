# ADR-001: Skill-First Architecture & Hybrid Fetching

- **Status:** Accepted
- **Date:** 2025-12-02
- **Feature:** AI Native Book Platform
- **Context:** We need consistent Urdu/Summaries across hundreds of pages, but Docusaurus is static.

## Decision

1.  Core Logic is centralized in `.claude/skills/` (not React components).
2.  **Fetching Strategy:** "Original" content is Static (SSG). "Personalized/Summaries" are Client-Side Fetched (CSR) on demand.

## Consequences

### Positive

*   Reusable AI logic across different parts of the platform.
*   Optimized performance for static content (Original).
*   Dynamic, personalized content delivery possible.

### Negative

*   Requires a "Skeleton Loader" state in the UI while fetching skills, impacting perceived performance.
*   Increased complexity in frontend data fetching logic.

## Alternatives Considered

*   *Pure SSG:* Impossible for personalization (would require building 1 page per user).
*   *Pure CSR:* Bad SEO for original content, slower initial load for all content.

## References

- Feature Spec: /mnt/d/piaic/cli-practice/robotics-book/specs/001-ai-native-book-platform/spec.md
- Implementation Plan: /mnt/d/piaic/cli-practice/robotics-book/specs/001-ai-native-book-platform/plan.md
- Related ADRs: None
- Evaluator Evidence: N/A
