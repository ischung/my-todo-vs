import { test, expect } from '@playwright/test';

async function addTodo(page, title) {
  const today = new Date().toISOString().slice(0, 10);
  await page.getByRole('button', { name: today }).click();
  await page.getByRole('button', { name: '+ 할일 추가' }).click();
  await page.getByLabel('새 할일 제목').fill(title);
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByText(title)).toBeVisible();
}

test('@feature 확인 시 할일이 삭제된다', async ({ page }) => {
  await page.goto('/');
  const title = `삭제테스트 ${Date.now()}`;
  await addTodo(page, title);

  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: `${title} 삭제` }).click();

  await expect(page.getByText(title)).toHaveCount(0, { timeout: 5000 });
});

test('@feature 취소 시 할일이 유지된다', async ({ page }) => {
  await page.goto('/');
  const title = `취소테스트 ${Date.now()}`;
  await addTodo(page, title);

  page.once('dialog', (d) => d.dismiss());
  await page.getByRole('button', { name: `${title} 삭제` }).click();

  // wait a bit to ensure no delete happened
  await page.waitForTimeout(500);
  await expect(page.getByText(title)).toBeVisible();
});

test('@feature 삭제 버튼에 aria-label이 있다', async ({ page }) => {
  await page.goto('/');
  const title = `접근성테스트 ${Date.now()}`;
  await addTodo(page, title);

  const deleteBtn = page.getByRole('button', { name: `${title} 삭제` });
  await expect(deleteBtn).toBeVisible();
});
