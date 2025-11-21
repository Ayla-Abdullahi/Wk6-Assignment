import React from 'react';
import { render, screen } from '@testing-library/react';
import PostList from '../../components/PostList';

describe('PostList integration-style', () => {
  it('renders posts from API', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([{ _id: '1', title: 'Hello' }]) });
    render(<PostList fetchImpl={mockFetch} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await screen.findByText('Hello');
    expect(mockFetch).toHaveBeenCalledWith('/api/posts');
  });
});
