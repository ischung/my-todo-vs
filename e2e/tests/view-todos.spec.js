import { test, expect } from '@playwright/test';

test('@feature 오늘 날짜가 시각적으로 강조된다', async ({ page }) => {
  await page.goto('/');
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  const todayCell = page.getByRole('button', { name: iso });
  await expect(todayCell).toBeVisible();
  // today-selected 또는 ring 클래스가 있어야 함
  await expect(todayCell).toHaveAttribute('aria-pressed', 'true');
});

test('@feature 이전/다음 달 버튼으로 월이 변경된다', async ({ page }) => {
  await page.goto('/');
  const monthHeading = page.getByRole('heading', { name: /\d{4}년 \d{1,2}월/ });
  const initial = await monthHeading.textContent();
  await page.getByLabel('이전 달').click();
  const prev = await monthHeading.textContent();
  expect(prev).not.toBe(initial);
  await page.getByLabel('다음 달').click();
  const back = await monthHeading.textContent();
  expect(back).toBe(initial);
});

test('@feature 빈 날짜 선택 시 EmptyState 안내가 뜬다', async ({ page }) => {
  await page.goto('/');
  // pick a day far in future that's unlikely to have todos
  const future = new Date();
  future.setFullYear(future.getFullYear() + 2);
  const iso = future.toISOString().slice(0, 10);
  // navigate month until we find the cell
  for (let i = 0; i < 30; i++) {
    const cell = page.getByRole('button', { name: iso });
    if (await cell.isVisible()) {
      await cell.click();
      break;
    }
    await page.getByLabel('다음 달').click();
  }
  await expect(page.getByText(/첫 번째 할일을 추가해보세요/)).toBeVisible({
    timeout: 5000,
  });
});
