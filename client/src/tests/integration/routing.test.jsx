import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

// Mock PostList to avoid network/state timing and provide a stable marker
jest.mock('../../components/PostList', () => () => <h1>Posts</h1>);

describe('App routing', () => {
  it('renders Home at root path', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  it('renders PostList at /posts', () => {
    window.history.pushState({}, '', '/posts');
    render(<App />);
    expect(screen.getByRole('heading', { name: /posts/i })).toBeInTheDocument();
  });
});
