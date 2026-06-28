# Agent Skills Review & Workflow

This document outlines the available agent skills, when to use them, and how they flow together.

## Available Skills

- **`start-new-agent`**: Call this when a new agent session begins to load the project's architectural rules and documentation standards.
- **`to-prd-project`**: Call this after planning a new feature to formally spec it out and publish it as a GitHub Issue in the `a1stok/img2svg-animation` repo.
- **`to-issues-project`**: Call this on an approved PRD issue to break it down into native GitHub sub-issues (vertical slices).
- **`do-work`**: Call this to implement a specific sub-issue. It enforces a strict test-driven development loop before committing.
- **`improve-codebase-architecture-project`**: Call this periodically or when code feels messy to refactor logic into deeper modules without changing external behavior.
- **`optimize-loader`**: Call this when reviewing data-fetching code to fix N+1 queries and parallelize requests.
- **`tailwind-design-system`**: Call this when building UI to ensure adherence to centralized Tailwind tokens and accessible design patterns.

## Typical Agent Workflow

```
[User Chat: Plan Feature] -->|invoke to-prd-project| [PRD GitHub Issue Created]
[PRD GitHub Issue Created] -->|invoke to-issues-project| [GitHub Sub-Issues Created]

[GitHub Sub-Issues Created] --> [Sub-Issue 1]
[GitHub Sub-Issues Created] --> [Sub-Issue 2]
[GitHub Sub-Issues Created] --> [Sub-Issue 3]

[Sub-Issue 1] -->|invoke do-work| [Implement and Test Code]
[Implement and Test Code] --> [Commit and Close Sub-Issue]

[Commit and Close Sub-Issue] -->|Move to next| [Sub-Issue 2]
```
