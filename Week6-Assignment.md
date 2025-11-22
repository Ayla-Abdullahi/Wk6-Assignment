# 🧪 Week 6: Testing and Debugging – Ensuring MERN App Reliability

## 🚀 Objective
Implement comprehensive testing strategies for a MERN stack application, including unit testing, integration testing, and end-to-end testing, while also learning debugging techniques to identify and fix common issues.

## 📂 Tasks

### Task 1: Setting Up Testing Environment
- Configure Jest as the testing framework for both client and server
- Set up testing utilities for React components (React Testing Library)
- Configure Supertest for API endpoint testing
- Create a separate test database for integration tests
- Implement test scripts in package.json for running different types of tests

### Task 2: Unit Testing
- Write unit tests for utility functions in both client and server
- Test React components in isolation using mocks for dependencies
- Implement tests for Redux reducers and actions (if applicable)
- Create tests for custom hooks in React
- Test Express middleware functions
- Achieve at least 70% code coverage for unit tests

### Task 3: Integration Testing
- Write tests for API endpoints using Supertest
- Test database operations with a test database
- Implement integration tests for React components that interact with APIs
- Test authentication flows
- Create tests for form submissions and data validation

### Task 4: End-to-End Testing
- Set up Cypress or Playwright for end-to-end testing
- Create tests for critical user flows (e.g., registration, login, CRUD operations)
- Test navigation and routing
- Implement tests for error handling and edge cases
- Create visual regression tests for UI components

### Task 5: Debugging Techniques
- Use logging strategies for server-side debugging
- Implement error boundaries in React
- Use browser developer tools for client-side debugging
- Create a global error handler for the Express server
- Implement performance monitoring and optimization

## 🧪 Expected Outcome
- A comprehensive test suite for a MERN stack application
- Well-documented testing strategies and methodologies
- High code coverage for critical application features
- Improved application reliability and stability
- Implementation of debugging tools and techniques

## 🛠️ Setup
1. Clone the starter code repository
2. Install dependencies for both client and server:
   ```
   # In the root directory
   npm run install-all
   ```
3. Set up the test database:
   ```
   # In the server directory
   npm run setup-test-db
   ```
4. Run the tests:
   ```
   # Run all tests
   npm test
   
   # Run only unit tests
   npm run test:unit
   
   # Run only integration tests
   npm run test:integration
   
   # Run only end-to-end tests
   npm run test:e2e
   ```

## ✅ Submission Instructions
1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Complete all the tasks in the assignment
4. Commit and push your code regularly to show progress
5. Include in your repository:
   - Complete test files for unit, integration, and end-to-end testing
   - Documentation of your testing strategy
   - Screenshots of test coverage reports
   - Examples of debugging techniques implemented
6. Your submission will be automatically graded based on the criteria in the autograding configuration
7. The instructor will review your submission after the autograding is complete 

---

## 📘 Implementation Summary (Completed State)

This repository now fulfills and extends the original Week 6 objectives. Below is a concise mapping of tasks to implemented solutions:

| Original Task | Implemented Solution |
|---------------|----------------------|
| Jest config for client/server | Multi-project `jest.config.js` (jsdom + node) |
| React Testing Library setup | Component, hook, routing, Redux slice tests |
| Supertest API tests | CRUD posts + auth register/login integration tests |
| Test DB setup | Replaced with Mongoose query mocks (integration) + in-memory store for E2E (`USE_INMEMORY_DB=1`) |
| Unit tests (utils/components/hooks/middleware) | Covered: Button, PostList, ErrorBoundary, format utils, `useFetchPosts`, auth middleware, logger, slice |
| Integration tests (API, auth) | Full posts lifecycle + auth token issuance validated |
| End-to-end framework | Playwright (API request context + browser page) |
| Critical user flows | Register → Login → Create → List/Filter → Delete (flows.spec) |
| Navigation & routing | RTL integration tests (About route, dynamic navigation) |
| Visual regression | Playwright screenshot of `/visual/button` route (`buttons.png`) |
| Error handling | Express error handler + React ErrorBoundary + cleanup guard in hook |
| Logging strategies | Request logger utility; structured error responses |
| Performance monitoring | `web-vitals` stub prepared for integration |

### 🔐 Auth & JWT
Unified secret (`process.env.JWT_SECRET || 'testsecret'`) across utilities, middleware, and routes to prevent token mismatches during tests.

### 🧠 Hook Cleanup Pattern
`useFetchPosts` test ensures abort-safe state updates (unmounted component will not set state).

### 🗄️ In-Memory Data Fallback
For E2E reliability, enabling `USE_INMEMORY_DB=1` starts server using an array store instead of MongoDB, avoiding external service dependency and buffering timeouts.

### 🖼️ Visual Regression Workflow
First Playwright run creates baseline snapshot. Subsequent runs diff; failing test signals UI drift. Baseline lives under `e2e/tests/visual/...-snapshots/`.

### 📊 Coverage Status
Thresholds: Statements/Lines/Functions ≥ 70%, Branches ≥ 60%. Client ≈ 98% statements (App.jsx 100%). Server meets all thresholds; memory-only branches marked optional.

### 🧪 Updated Run Commands
```
npm run install-all      # install all dependencies
npm test                 # run all Jest projects
npm run test:unit        # client-side tests
npm run test:integration # server-side tests
npm run e2e:server       # start server with in-memory posts store
npm run test:e2e         # Playwright E2E + visual regression
```

### 🐞 Common Debugging Resolutions
| Issue | Resolution |
|-------|------------|
| 401 during E2E post create | Align JWT secret everywhere |
| Mongoose buffering timeout | Use `e2e:server` (in-memory) for Playwright |
| Visual test baseline fail | Accept first run; commit snapshot |
| Routing test crash (nested routers) | Render `App` directly without extra `<Router>` |

### ➕ Suggested Future Enhancements
- Add accessibility audits (axe) in Playwright
- Negative auth tests (expired/invalid token)
- Performance budget assertions via `web-vitals` export
- Contract tests (Pact) for posts service

### 📄 Further Detail
See `README.md` and `TESTING_STRATEGY.md` for richer explanations of layering and rationale.

---
End of implementation summary.