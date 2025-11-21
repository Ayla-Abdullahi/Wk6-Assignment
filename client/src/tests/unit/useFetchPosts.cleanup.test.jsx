import React from 'react';
import { render } from '@testing-library/react';
import { useFetchPosts } from '../../hooks/useFetchPosts';

// Component to exercise cleanup path by unmounting before fetch resolves
function Harness({ fetchImpl }) {
  useFetchPosts(fetchImpl);
  return <div>Harness</div>;
}

describe('useFetchPosts cleanup', () => {
  it('does not set state after unmount', async () => {
    let resolve;
    const delayed = new Promise(res => { resolve = res; });
    const mockFetch = jest.fn(() => delayed);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { unmount } = render(<Harness fetchImpl={mockFetch} />);
    // Unmount before fetch resolves
    unmount();
    // Resolve with successful response shape
    resolve({ ok: true, json: async () => [] });
    // Microtask flush
    await Promise.resolve();
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});