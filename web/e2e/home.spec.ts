import { expect, test } from '@playwright/test';

test('the English home presents the landing with the real catalog numbers', async ({ page }) => {
  await page.goto('/en');
  await expect(page).toHaveTitle('editonny — video editing through conversation');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toContainText('You ask.');
  await expect(heading).toContainText('Your video gets');
  for (const name of [/Every request is/, /Fewer operations/, /Input, request/, /The site teaches/, /One idea/, /From download to/, /An editor costs/]) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
  }
  await expect(page.getByText('54 ready-made requests and 145 motion scenes. Explore freely.')).toBeVisible();
});

test('the repository calls to action open GitHub in a new tab', async ({ page }) => {
  await page.goto('/pt-br');
  const cta = page.getByRole('main').getByRole('link', { name: /^Acessar skill/ }).first();
  await expect(cta).toHaveAttribute('href', 'https://github.com/soumatheusgomes/editonny');
  await expect(cta).toHaveAttribute('target', '_blank');
});

test('reduced motion shows the finished sample, chapters still pick a step, and every section is readable', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/en');
  await expect(page.getByText('Sample to review')).toBeVisible();
  await page.getByRole('button', { name: 'Raw', exact: true }).click();
  await expect(page.getByText('Sample to review')).toBeHidden();
  await expect(page.locator('#demo').getByText('RAW', { exact: true })).toBeVisible();
  await page.goto('/es');
  await expect(page.getByRole('heading', { level: 2, name: /Menos operaciones/ })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: /Cada pedido es/ })).toBeVisible();
  await context.close();
});

test('the library searches, switches to scenes, filters by family, and opens dialogs', async ({ page }) => {
  await page.goto('/en');
  const library = page.locator('#library');
  await library.getByLabel('Search the library').fill('lesson');
  await expect(library.getByText(/^\d+ requests? for “lesson”$/)).toBeVisible();
  await library.getByRole('button', { name: /A lesson with a clear opening/ }).click();
  const dialog = page.getByRole('dialog', { name: /A lesson with a clear opening/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Customize request' })).toHaveAttribute('href', '/en/create?example=lesson');
  await page.keyboard.press('Escape');
  await library.getByLabel('Search the library').fill('');
  await library.getByRole('button', { name: /^Motion scenes/ }).click();
  await expect(library.getByText('145 scenes')).toBeVisible();
  await library.getByRole('button', { name: /^Professions/ }).click();
  const count = Number((await library.getByText(/^\d+ scenes?$/).textContent())!.split(' ')[0]);
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(145);
  await library.getByLabel('Search the library').fill('zzzz-nothing');
  await expect(library.getByText(/Nothing found for “zzzz-nothing”/)).toBeVisible();
});

test('the agent choice changes the copied request and is shared with the builder', async ({ page }) => {
  await page.goto('/en');
  const library = page.locator('#library');
  await library.getByRole('radio', { name: 'Claude Code' }).click();
  await library.getByRole('button', { name: /A lesson with a clear opening/ }).click();
  await expect(page.getByRole('dialog').locator('pre')).toHaveText(/^\/editonny\n/);
  await page.goto('/en/create');
  await expect(page.getByRole('radio', { name: /Claude Code/ })).toBeChecked();
});

test('the lab motion scene and the guide button steer the library', async ({ page }) => {
  await page.goto('/pt-br');
  await page.locator('#lab').getByRole('radio', { name: 'Motion' }).click();
  await page.locator('#lab').getByRole('link', { name: /Cena do catálogo: Três passos empilhados/ }).click();
  const library = page.locator('#library');
  await expect(library.getByLabel('Buscar na biblioteca')).toHaveValue('Três passos empilhados');
  await expect(library.getByRole('button', { name: /Três passos empilhados/ })).toBeVisible();
  await page.getByRole('button', { name: 'Usar “Meu primeiro vídeo”' }).click();
  await expect(page.getByRole('dialog', { name: 'Meu primeiro vídeo' })).toBeVisible();
});

test('the install request is the canonical one and can be copied', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/en');
  await page.getByRole('button', { name: 'Copy install request' }).click();
  await expect(page.getByText('Install request copied ✓')).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('First read skills/editonny/SKILL.md');
  expect(copied).toContain('Ask before paid services or sending my media.');
});

test('switching language keeps the home section and stores the choice', async ({ page, context }) => {
  await page.goto('/en#library');
  await page.getByRole('button', { name: /^Language: English/ }).click();
  await page.getByRole('option', { name: /Português/ }).click();
  await expect(page).toHaveURL(/\/pt-br#library$/);
  // Next.js keeps the previous page hidden in the DOM; only the visible library counts.
  await expect(page.locator('#library').filter({ visible: true })).toBeInViewport();
  await expect.poll(async () => (await context.cookies()).find(item => item.name === 'NEXT_LOCALE')?.value).toBe('pt-BR');
});

test('the comparison plays once and can be stopped on its result or replayed', async ({ page }) => {
  await page.goto('/en#open-source');
  const offer = page.locator('#open-source');
  await offer.getByRole('button', { name: 'Show the result' }).click();
  await expect(offer.getByRole('button', { name: 'Replay' })).toBeVisible();
  await expect(offer.getByText('1 delivered')).toBeVisible();
});
