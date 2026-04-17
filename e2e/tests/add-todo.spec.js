import { test, expect } from '@playwright/test';

test('@feature 오늘 날짜에 할일을 추가하면 목록에 즉시 반영된다', async ({ page }) => {
  await page.goto('/');
  const today = new Date().toISOString().slice(0, 10);
  await page.getByRole('button', { name: today }).click();

  await page.getByRole('button', { name: '+ 할일 추가' }).click();
  const title = `E2E 테스트 할일 ${Date.now()}`;
  await page.getByLabel('새 할일 제목').fill(title);
  await page.getByRole('button', { name: '저장' }).click();

  await expect(page.getByText(title)).toBeVisible({ timeout: 5000 });
});

test('@feature 빈 제목으로는 저장 버튼이 비활성이다', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+ 할일 추가' }).click();
  const saveBtn = page.getByRole('button', { name: '저장' });
  await expect(saveBtn).toBeDisabled();
});

test('@feature 취소 버튼으로 입력 모드를 닫을 수 있다', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+ 할일 추가' }).click();
  await expect(page.getByRole('button', { name: '취소' })).toBeVisible();
  await page.getByRole('button', { name: '취소' }).click();
  await expect(page.getByRole('button', { name: '+ 할일 추가' })).toBeVisible();
});
