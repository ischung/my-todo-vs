import { test, expect } from '@playwright/test';

async function addTodo(page, title) {
  const today = new Date().toISOString().slice(0, 10);
  await page.getByRole('button', { name: today }).click();
  await page.getByRole('button', { name: '+ 할일 추가' }).click();
  await page.getByLabel('새 할일 제목').fill(title);
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByText(title)).toBeVisible();
}

test('@feature 체크박스를 클릭하면 취소선이 생긴다', async ({ page }) => {
  await page.goto('/');
  const title = `토글테스트 ${Date.now()}`;
  await addTodo(page, title);

  const item = page.getByRole('listitem').filter({ hasText: title });
  const checkbox = item.getByRole('checkbox');
  const titleBtn = item.getByRole('button', { name: `${title} 수정` });

  // click instead of .check() — controlled checkbox updates via API
  await checkbox.click();
  await expect(titleBtn).toHaveClass(/line-through/);
  await expect(checkbox).toBeChecked();

  // toggle back
  await checkbox.click();
  await expect(titleBtn).not.toHaveClass(/line-through/);
  await expect(checkbox).not.toBeChecked();
});

test('@feature 제목을 클릭해 인라인 편집 후 Enter로 저장된다', async ({ page }) => {
  await page.goto('/');
  const title = `편집테스트 ${Date.now()}`;
  await addTodo(page, title);

  await page.getByRole('button', { name: `${title} 수정` }).click();
  const input = page.getByLabel('할일 제목 편집');
  await expect(input).toBeVisible();
  await input.fill(`${title} (수정됨)`);
  await input.press('Enter');

  await expect(page.getByText(`${title} (수정됨)`)).toBeVisible();
});

test('@feature 빈 제목으로 편집 저장 시 에러가 표시된다', async ({ page }) => {
  await page.goto('/');
  const title = `빈편집테스트 ${Date.now()}`;
  await addTodo(page, title);

  await page.getByRole('button', { name: `${title} 수정` }).click();
  const input = page.getByLabel('할일 제목 편집');
  await expect(input).toBeVisible();
  await input.fill('');
  await input.press('Enter');

  await expect(page.getByText('제목을 입력해주세요')).toBeVisible();
});
