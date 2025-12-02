# ADR-003: Agentic RAG vs Simple QA

- **Status:** Accepted
- **Date:** 2025-12-02
- **Feature:** AI Native Book Platform
- **Context:** Users need to ask questions about specific text and get high-accuracy answers.

## Decision

We will use **OpenAI Agents** (Reasoning Loop) + **Qdrant** (Vector Context). We will NOT use simple "Search & Summarize".

## Consequences

### Positive

*   Provides high-accuracy, contextually relevant answers for complex technical questions.
*   Enables reasoning loop for more intelligent responses.

### Negative

*   Higher latency (2-4 seconds per response).
*   Requires building a "Thinking..." / "Scanning..." animation to manage user expectations.

## Alternatives Considered

*   *Simple Embedding Search:* Rejected (Too dumb for "Robotics" technical questions).

## References

- Feature Spec: /mnt/d/piaic/cli-practice/robotics-book/specs/001-ai-native-book-platform/spec.md
- Implementation Plan: /mnt/d/piaic/cli-practice/robotics-book/specs/001-ai-native-book-platform/plan.md
- Related ADRs: None
- Evaluator Evidence: N/A
