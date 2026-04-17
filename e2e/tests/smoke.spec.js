import { test, expect } from '@playwright/test';

test('@smoke 앱 진입 시 앱 타이틀이 보인다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '날짜별 할일 관리' })).toBeVisible({
    timeout: 15000,
  });
});

test('@smoke /api/health 엔드포인트가 200 ok를 반환한다', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe('ok');
  expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  expect(body.version).toBeDefined();
});

test('@smoke FE가 서버 연결 OK 메시지를 표시한다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/서버 연결 OK/)).toBeVisible({ timeout: 15000 });
});
