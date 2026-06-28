When your change touches code that interacts with the database, use this TDD workflow.

## Principles

1. **Validate using the interface.** Test the behavior through the same path the real app uses. Call the service method, hit the real (in-memory) database (via PGLite), and assert on the result. Never test internal query structure, intermediate state, or how the service builds its SQL.

2. **Don't test what the type system proves.** If TypeScript already guarantees a return shape, required fields, or argument types, don't write a test for it. Focus tests on runtime behavior the compiler can't verify: correct ordering, data relationships after mutation, conflict resolution, edge cases in business logic.

3. **One test at a time.** Write a single failing test, make it pass, then write the next one. Each test you add should teach you something new about the implementation. If you batch-write tests upfront, you end up with tests that don't actually validate anything useful.

## Workflow

### 1. Write a SINGLE failing test first

### 2. Make it pass with the simplest implementation

### 3. Repeat 1 & 2 until the feature is complete

### 4. Refactor under green tests
