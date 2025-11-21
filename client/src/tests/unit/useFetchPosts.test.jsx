import { renderHook, waitFor } from '@testing-library/react';
import { useFetchPosts } from '../../hooks/useFetchPosts';

describe('useFetchPosts hook', () => {
  it('fetches and returns data', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([{ _id: '1', title: 'A' }]) });
    const { result } = renderHook(() => useFetchPosts(mockFetch));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data.length).toBe(1);
  });

  it('handles fetch error', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useFetchPosts(mockFetch));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });
});
