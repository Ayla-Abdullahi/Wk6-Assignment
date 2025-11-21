import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

describe('App navigation links', () => {
  it('navigates to About when link clicked', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    const aboutLink = screen.getByRole('link', { name: /about/i });
    fireEvent.click(aboutLink);
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
  });
});