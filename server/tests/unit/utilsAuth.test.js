const { generateToken } = require('../../src/utils/auth');
const jwt = require('jsonwebtoken');

describe('utils/auth generateToken', () => {
  it('signs a JWT with user id', () => {
    const token = generateToken({ _id: 'user123' });
    const decoded = jwt.verify(token, 'testsecret');
    expect(decoded.id).toBe('user123');
  });
});
