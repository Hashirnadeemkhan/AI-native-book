# ADR-002: The Cybernetic Toggle Auth UI

- **Status:** Accepted
- **Date:** 2025-12-02
- **Feature:** AI Native Book Platform
- **Context:** The spec requires a "Power Switch" metaphor, but Docusaurus provides a standard "Login" link.

## Decision

We will build a Custom React Component (`AuthToggle`) that bypasses the standard Docusaurus Navbar Auth.

## Consequences

### Positive

*   Maintains the "Cybernetic HUD" aesthetic and user experience.

### Negative

*   Requires manual handling of Auth State (Guest/User) in a React Context, adding complexity to the frontend.

## Alternatives Considered

*   *Standard Docusaurus Auth:* Rejected (Breaks the "Cybernetic HUD" immersion).

## References

- Feature Spec: /mnt/d/piaic/cli-practice/robotics-book/specs/001-ai-native-book-platform/spec.md
- Implementation Plan: /mnt/d/piaic/cli-practice/robotics-book/specs/001-ai-native-book-platform/plan.md
- Related ADRs: None
- Evaluator Evidence: N/A
