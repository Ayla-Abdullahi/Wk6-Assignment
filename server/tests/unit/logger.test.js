const { logInfo, logError } = require('../../src/utils/logger');

describe('logger utility', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  it('logs info messages', () => {
    logInfo('test info', { meta: 1 });
    expect(console.log).toHaveBeenCalled();
  });

  it('logs error messages', () => {
    logError('test error', { meta: 2 });
    expect(console.error).toHaveBeenCalled();
  });
});
