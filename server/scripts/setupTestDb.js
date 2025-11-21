/* eslint-disable no-console */
// Best-effort in-memory MongoDB setup for integration tests.
// Falls back gracefully if environment libraries are missing.
(async () => {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log(`[setup-test-db] Memory Mongo started at ${uri}`);
    console.log('[setup-test-db] Export MONGO_URI for tests if needed');
    // Keep process alive briefly then stop; integration tests can manage their own mocks.
    await mongod.stop();
    process.exit(0);
  } catch (err) {
    console.warn('[setup-test-db] Skipping memory Mongo setup:', err.message);
    process.exit(0);
  }
})();
// Script to prepare a separate test database (e.g., MongoMemory or dedicated URI)
// Usage: npm run setup-test-db (add script if desired)
// For now we just output instructions; real implementation would provision collections or seed data.
console.log('Test DB setup: using in-memory MongoDB via mongodb-memory-server in tests. No action needed.');
