const errorHandler = require('../../src/middleware/errorHandler');

describe('errorHandler middleware', () => {
  const makeRes = () => {
    const res = {};
    res.statusCode = 0;
    res.status = jest.fn(function(code){ this.statusCode = code; return this; });
    res.json = jest.fn(function(payload){ this.payload = payload; return this; });
    return res;
  };

  it('returns provided statusCode and error message', () => {
    const err = new Error('Boom');
    err.statusCode = 418;
    const req = {};
    const res = makeRes();
    const next = jest.fn();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ error: 'Boom' });
  });

  it('defaults to 500 and fallback message when statusCode missing and message empty', () => {
    const err = new Error('');
    const req = {};
    const res = makeRes();
    const next = jest.fn();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
