---
name: do-work
description: "End-to-end implementation workflow. Use when user wants to implement a feature, fix a bug, or make changes and have everything validated and committed."
---

# Do Work

Complete implementation workflow from exploration to commit.

## Workflow

### Phase 1: Explore & Plan

### Phase 2: Implement

If you're touching code that interacts with the database, follow the [DB TDD workflow](DB-TDD.md).

If you're touching frontend code with complex state (creating/modifying reducers, complex state transitions, non-trivial state management), follow the [Frontend TDD workflow](FRONTEND-TDD.md).

### Phase 3: Feedback Loops & Verification

Run each check, fix issues, and re-run until clean. Do these sequentially:

1. **Type checking**: `npm run typecheck`
2. **Tests**: `npm test`

If a check fails, fix the issue and re-run that check before moving to the next one. Do not move on with failing checks.

3. **Verify Acceptance Criteria**: Review the original sub-issue body. Ensure all acceptance criteria are met.
   - If the implementation is complex, consider invoking a subagent (e.g., `research` or `self`) or manually running the app to verify the end-to-end behavior matches what was promised.
   - Update the sub-issue on GitHub to check off the completed acceptance criteria boxes (e.g., replace `[ ]` with `[x]`).

### Phase 4: Commit & Close

1. **One Commit per Sub-Issue**: Once all tests pass and criteria are verified, commit your work to the active branch following the rules in **[docs/committing.md](../../../docs/committing.md)**.
2. **Close Sub-Issue**: If you were working on a GitHub sub-issue, close it using the GitHub CLI (`gh issue close <issue-number>`) at the end of your implementation run.
3. **Push Commits**: Push your branch to remote. If you are working on `master`, simply push. If you are on an agent branch, you may merge it to `master` and push if the milestone is complete.
4. **Draft PR (Optional)**: Only open a Pull Request if the user explicitly requested a code review or a PR. If just commits are enough, do not create a PR. If the final sub-issue of a PRD is completed, manually close the parent PRD.
