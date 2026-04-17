import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'ok',
          timestamp: '2026-04-17T12:00:00.000Z',
          version: 'test',
        }),
      })
    );
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('날짜별 할일 관리')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/서버 확인 중/)).toBeInTheDocument();
  });
});
