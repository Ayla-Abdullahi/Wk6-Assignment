const User = require('../../src/models/User');

describe('User model password hashing pre-save hook', () => {
  it('hashes password via pre-save hook', async () => {
    const user = new User({ username: 'alice', email: 'a@example.com', password: 'plainpass' });
    // Execute pre-save middleware chain manually to avoid needing a DB connection
    await new Promise((resolve, reject) => {
      // Access Kareem hooks executor
      const hooks = user.constructor.schema.s.hooks;
      hooks.execPre('save', user, [], err => {
        if (err) return reject(err);
        resolve();
      });
    });
    expect(user.password).not.toBe('plainpass');
    // bcrypt hashes start with $2
    expect(user.password.startsWith('$2')).toBe(true);
  });

  it('does not re-hash password if not modified', async () => {
    const user = new User({ username: 'bob', email: 'b@example.com', password: 'initial' });
    // First hash
    await new Promise((resolve, reject) => {
      const hooks = user.constructor.schema.s.hooks;
      hooks.execPre('save', user, [], err => (err ? reject(err) : resolve()));
    });
    const firstHash = user.password;
    // Simulate no modification
    user.isModified = () => false; // override method used in hook
    await new Promise((resolve, reject) => {
      const hooks = user.constructor.schema.s.hooks;
      hooks.execPre('save', user, [], err => (err ? reject(err) : resolve()));
    });
    expect(user.password).toBe(firstHash);
  });
});
