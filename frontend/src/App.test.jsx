import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })
    );
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('날짜별 할일 관리')).toBeInTheDocument();
  });

  it('renders week day headers', () => {
    render(<App />);
    expect(screen.getByText('일')).toBeInTheDocument();
    expect(screen.getByText('토')).toBeInTheDocument();
  });

  it('renders month navigation buttons', () => {
    render(<App />);
    expect(screen.getByLabelText('이전 달')).toBeInTheDocument();
    expect(screen.getByLabelText('다음 달')).toBeInTheDocument();
  });
});
