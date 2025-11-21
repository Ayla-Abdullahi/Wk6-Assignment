const authMiddleware = require('../../src/middleware/auth');
const { generateToken } = require('../../src/utils/auth');

describe('authMiddleware', () => {
  it('returns 401 when no Authorization header', () => {
    const req = { header: () => null };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('sets req.user when valid token provided', () => {
    const token = generateToken({ _id: 'abc123' });
    const req = { header: () => `Bearer ${token}` };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(req.user).toEqual({ id: 'abc123' });
    expect(next).toHaveBeenCalled();
  });
});
