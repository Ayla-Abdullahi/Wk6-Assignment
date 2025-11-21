# Testing & Debugging Strategy

## Overview
This document summarizes the multi-layer testing and debugging approach for the MERN application per Week 6 assignment requirements.

## Layers
1. Unit Tests: Utilities (`client/src/utils`), React components (Button, ErrorBoundary), custom hook (`useFetchPosts`), Redux slice (`postsSlice`), server utilities (auth, logger), Express middleware (authMiddleware).
2. Integration Tests: Server API (`posts` endpoints), React component (`PostList`) interacting with mocked API, database operations via `mongodb-memory-server`.
3. End-to-End Tests: Playwright config + placeholder spec; expand to cover auth flows, CRUD.
4. Debugging: Logging (`logger`), global Express error handler, React Error Boundary, performance (placeholder for web-vitals), structured JWT auth handling.

## Tools
- Jest projects (client & server) configured in `jest.config.js`.
- React Testing Library for component and hook tests.
- Supertest for API endpoint tests.
- MongoMemoryServer for isolated test database.
- Playwright for E2E tests.

## Coverage Goals
Configured global coverage threshold: 70% statements/functions/lines; 60% branches. Additional tests added to increase coverage.

## Execution
```bash
npm run install-all
npm test            # all jest tests
npm run test:unit   # client project
npm run test:integration # server project (API + middleware + utils)
npm run test:e2e    # Playwright
```

## Debugging Techniques
- Server logging for each request.
- Central error handler capturing stack traces.
- ErrorBoundary for graceful client UI degradation.
- JWT auth utility for consistent token handling.

## Next Improvements
- Flesh out E2E tests for auth and CRUD.
- Add visual regression (e.g., Playwright snapshots or Storybook + Chromatic).
- Integrate web-vitals reporting and performance budgets.
## Test coverage report
