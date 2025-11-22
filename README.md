# Testing and Debugging MERN Applications

This assignment focuses on implementing comprehensive testing strategies for a MERN stack application, including unit testing, integration testing, and end-to-end testing, along with debugging techniques.

## Assignment Overview

You will:
1. Set up testing environments for both client and server
2. Write unit tests for React components and server functions
3. Implement integration tests for API endpoints
4. Create end-to-end tests for critical user flows
5. Apply debugging techniques for common MERN stack issues

## Project Structure (Actual)

```
Wk6-Assignment/
├── jest.config.js                 # Multi-project Jest (client + server)
├── babel.config.js                # Babel presets for React/JSX
├── playwright.config.js           # Playwright E2E & visual regression
├── README.md / Week6-Assignment.md
├── TESTING_STRATEGY.md            # Detailed test & debug layers
├── client/
│   ├── package.json
│   └── src/
│       ├── App.jsx                # BrowserRouter + routes
│       ├── components/            # Button, PostList, ErrorBoundary
│       ├── hooks/                 # useFetchPosts
│       ├── store/                 # postsSlice (Redux Toolkit)
│       ├── utils/                 # format.js
│       └── tests/
│           ├── unit/              # component, hook, slice, utils tests
│           └── integration/       # routing & PostList integration tests
├── server/
│   ├── package.json
│   └── src/
│       ├── app.js                 # Express app, posts routes, visual route
│       ├── index.js               # Server entry
│       ├── models/                # Post, User
│       ├── routes/                # auth (register/login)
│       ├── middleware/            # auth, errorHandler
│       ├── utils/                 # auth (jwt), logger
│       └── scripts/               # setupTestDb placeholder
│   └── tests/
│       ├── unit/                  # middleware, utils, model tests
│       └── integration/           # posts & auth flows
├── e2e/
│   └── tests/                     # Playwright API flow + visual snapshot
└── coverage/                      # Jest coverage reports
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week6-Assignment.md` file
4. Explore the starter code and existing tests
5. Complete the tasks outlined in the assignment

## Key Testing Layers Implemented

| Layer | Tools | Scope |
|-------|-------|-------|
| Unit | Jest, React Testing Library | Components, hooks, Redux slice, utilities, middleware, model hooks |
| Integration | Jest + Supertest / RTL | API endpoints (posts/auth), component fetching (PostList), pagination & filtering |
| End-to-End | Playwright request & page API | Auth register/login, post create/list/delete flow, API health, routing |
| Visual Regression | Playwright `toHaveScreenshot` | `/visual/button` HTML route baseline `buttons.png` |
| Performance (baseline) | `web-vitals` (client `webVitals.js`) | Hook point for CLS/FID/LCP logging (extend later) |
| Debugging | Logger, ErrorBoundary, global error handler | Structured logs, captured errors, JWT consistency |

## Scripts

``bash
npm run install-all      # install root + client + server deps
npm test                 # all Jest projects
npm run test:unit        # client (React + Redux + hooks)
npm run test:integration # server (API/middleware/models)
npm run test:e2e         # Playwright tests (ensure server running or use e2e:server)
npm run e2e:server       # start server with in-memory DB fallback (USE_INMEMORY_DB=1)
npm run dev:server       # development server (no client bundler in this assignment)
```

## In-Memory DB Fallback
For E2E runs we avoid external MongoDB using an in-memory array store when `USE_INMEMORY_DB=1` is set. This isolates tests and removes dependency on a running Mongo instance. Standard Jest integration tests mock Mongoose queries instead of spinning up `mongodb-memory-server` (libcrypto limitations in some environments).

## JWT & Auth Consistency
Tokens are signed with `process.env.JWT_SECRET || 'testsecret'` across utilities, middleware, and auth routes to ensure compatibility between unit, integration, and E2E flows.

## Visual Regression
`/visual/button` route serves deterministic HTML; Playwright captures `buttons.png` baseline on first run. Subsequent runs compare against snapshot for unintended UI drift.

## Performance Hooks
`client/src/webVitals.js` provides a stub to capture Web Vitals and route them to `console` or a future monitoring endpoint. Extend by importing and invoking its reporter in your main entry (e.g., index.jsx) if a full client build is added.

## Debugging Techniques Used
- Structured request logging (`logger.js`)
- Centralized Express error handler (`errorHandler.js`)
- React ErrorBoundary for component failures
- Test-driven mocks for network and data layers
- Cleanup pattern in `useFetchPosts` prevents state updates after unmount

## Coverage Thresholds
Configured in `jest.config.js`: Statements/Lines/Functions ≥ 70%, Branches ≥ 60%. Client presently exceeds these (≈98% statements). Server coverage meets thresholds under normal (non-memory) flows; memory fallback branches are optional to test.

## Running E2E & Visual Tests
1. Start server: `npm run e2e:server`
2. Execute tests: `npm run test:e2e`
3. First visual run creates baseline; review `test-results` for diffs on failure.

## Adding More Tests
- Extend Playwright to cover error cases (403/401) and pagination.
- Add snapshot or accessibility audits (e.g., axe) to UI tests.
- Write tests hitting memory fallback branches if desired for coverage.

## Troubleshooting
| Issue | Cause | Resolution |
|-------|-------|-----------|
| 401 on E2E post create | Secret mismatch | Ensure all modules use same `JWT_SECRET` |
| Mongoose buffering timeout | No Mongo instance | Use `USE_INMEMORY_DB=1` for E2E or start Mongo |
| Nested Router error in tests | Double `<Router>` wrapping | Render `App` directly & manipulate `history.pushState` |
| Visual test fails baseline | Snapshot missing | Accept first run as baseline or commit snapshot |

## Screenshots / Reports
Coverage HTML reports stored under `coverage/`. Visual snapshots under `e2e/tests/visual/...-snapshots/`.

## Additional Resources
See `TESTING_STRATEGY.md` for deeper rationale and layering explanations.

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Basic understanding of testing concepts

## Testing Tools

- Jest: JavaScript testing framework
- React Testing Library: Testing utilities for React
- Supertest: HTTP assertions for API testing
- Cypress/Playwright: End-to-end testing framework
- MongoDB Memory Server: In-memory MongoDB for testing

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all required tests (unit, integration, and end-to-end)
2. Achieve at least 70% code coverage for unit tests
3. Document your testing strategy in the README.md
4. Include screenshots of your test coverage reports
5. Demonstrate debugging techniques in your code

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)
- [MongoDB Testing Best Practices](https://www.mongodb.com/blog/post/mongodb-testing-best-practices) 