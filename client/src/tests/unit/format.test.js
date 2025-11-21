import { truncate, titleCase } from '../../utils/format';

describe('format utils', () => {
  it('truncate returns original when short', () => {
    expect(truncate('short', 10)).toBe('short');
  });
  it('truncate shortens long string', () => {
    expect(truncate('abcdefghijk', 5)).toBe('abcde…');
  });
  it('titleCase capitalizes words', () => {
    expect(titleCase('hello world')).toBe('Hello World');
  });
});
