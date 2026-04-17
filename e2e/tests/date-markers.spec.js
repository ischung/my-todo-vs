import { test, expect } from '@playwright/test';

async function addTodo(page, title) {
  const today = new Date().toISOString().slice(0, 10);
  await page.getByRole('button', { name: today }).click();
  await page.getByRole('button', { name: '+ 할일 추가' }).click();
  await page.getByLabel('새 할일 제목').fill(title);
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByText(title)).toBeVisible();
}

test('@feature 할일을 추가한 날짜에 점이 표시된다', async ({ page }) => {
  await page.goto('/');
  const title = `점표시테스트 ${Date.now()}`;
  await addTodo(page, title);

  const today = new Date().toISOString().slice(0, 10);
  const todayCell = page.getByRole('button', { name: today });
  await expect(todayCell.locator('[data-testid="date-marker"]')).toBeVisible({
    timeout: 5000,
  });
});

test('@feature 마지막 할일 삭제 시 점이 사라진다', async ({ page }) => {
  await page.goto('/');
  // Navigate to a far-future date (unlikely seeded) to ensure we control the state
  const future = new Date();
  future.setFullYear(future.getFullYear() + 3);
  future.setDate(15);
  const iso = future.toISOString().slice(0, 10);
  for (let i = 0; i < 40; i++) {
    const cell = page.getByRole('button', { name: iso });
    if (await cell.isVisible()) {
      await cell.click();
      break;
    }
    await page.getByLabel('다음 달').click();
  }

  // Add a single todo to the future date
  await page.getByRole('button', { name: '+ 할일 추가' }).click();
  const title = `삭제-점-테스트 ${Date.now()}`;
  await page.getByLabel('새 할일 제목').fill(title);
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByText(title)).toBeVisible();

  const cell = page.getByRole('button', { name: iso });
  await expect(cell.locator('[data-testid="date-marker"]')).toBeVisible();

  // Delete the todo
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: `${title} 삭제` }).click();

  // Marker should disappear
  await expect(cell.locator('[data-testid="date-marker"]')).toHaveCount(0, {
    timeout: 5000,
  });
});
