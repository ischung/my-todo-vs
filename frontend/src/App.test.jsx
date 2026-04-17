import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('날짜별 할일 관리')).toBeInTheDocument();
  });
});
