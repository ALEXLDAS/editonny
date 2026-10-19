import { expect, test } from '@playwright/test';

const PAGES = {
  'en-US': { prefix: '/en', create: '/en/create', lab: 'Lab', menu: 'Open menu', footer: [['Requests', '/en/examples'], ['Motion scenes', '/en/catalog'], ['Create a request', '/en/create'], ['Installation guide', '/en/install']] },
  'pt-BR': { prefix: '/pt-br', create: '/pt-br/criar', lab: 'Laboratório', menu: 'Abrir menu', footer: [['Pedidos', '/pt-br/exemplos'], ['Cenas de motion', '/pt-br/catalogo'], ['Criar pedido', '/pt-br/criar'], ['Guia de instalação', '/pt-br/instalacao']] },
  es: { prefix: '/es', create: '/es/crear', lab: 'Laboratorio', menu: 'Abrir menú', footer: [['Pedidos', '/es/ejemplos'], ['Escenas de motion', '/es/catalogo'], ['Crear pedido', '/es/crear'], ['Guía de instalación', '/es/instalacion']] },
} as const;

for (const [locale, page] of Object.entries(PAGES)) {
  test(`${locale}: header sections lead back to the home page and the footer reaches every page`, async ({ page: browser, isMobile }) => {
    await browser.goto(page.create);
    // Desktop section links live in the header; on phones they move into the menu dialog.
    if (isMobile) await browser.getByRole('button', { name: page.menu }).click();
    await browser.getByRole(isMobile ? 'dialog' : 'banner').getByRole('link', { name: page.lab, exact: true }).click();
    await expect(browser).toHaveURL(new RegExp(`${page.prefix}#lab$`));
    await expect(browser.locator('#lab')).toBeInViewport();
    for (const [label, path] of page.footer) {
      await browser.getByRole('contentinfo').getByRole('link', { name: label, exact: true }).click();
      await expect(browser).toHaveURL(new RegExp(`${path}$`));
    }
  });
}

test('the phone menu lists the standalone pages and marks the current one', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone menu');
  await page.goto('/pt-br');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Catálogo', exact: true }).click();
  await expect(page).toHaveURL(/\/pt-br\/catalogo$/);
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Catálogo', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('the language menu switches locale, keeps the page and query, and remembers the choice', async ({ page, context }) => {
  await page.goto('/en/catalog?q=title');
  await page.getByRole('button', { name: /^Language: English/ }).click();
  await page.getByRole('option', { name: /Português/ }).click();
  await expect(page).toHaveURL(/\/pt-br\/catalogo\?q=title$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  const cookie = (await context.cookies()).find(item => item.name === 'NEXT_LOCALE');
  expect(cookie?.value).toBe('pt-BR');
  // The choice outlives the browser session (a session cookie reports -1).
  expect(cookie!.expires * 1000).toBeGreaterThan(Date.now() + 300 * 24 * 60 * 60 * 1000);
  await page.goto('/');
  await expect(page).toHaveURL(/\/pt-br$/);
});

test('the skip link moves focus to the main content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard flow');
  await page.goto('/en/create');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main#main')).toBeFocused();
});

test('the mobile menu opens as a dialog and closes with Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/es');
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  const dialog = page.getByRole('dialog', { name: 'Menú' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('the theme toggle switches to light and survives a reload', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to the light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Switch to the dark theme' })).toBeVisible();
});

test('the language list stays inside a phone screen', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone layout');
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/pt-br');
  await page.getByRole('button', { name: /^Idioma: Português/ }).click();
  const panel = page.locator('.ds-lang__panel');
  await expect(panel).toBeVisible();
  const box = (await panel.boundingBox())!;
  const width = page.viewportSize()!.width;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
});

test('other pages do not prefetch the home page, whose head would preload its unused CSS and hero photo', async ({ page }) => {
  const prefetched: string[] = [];
  page.on('request', request => { if (request.headers()['next-router-prefetch'] && new URL(request.url()).pathname === '/en') prefetched.push(request.url()); });
  await page.goto('/en/catalog', { waitUntil: 'networkidle' });
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  expect(prefetched).toEqual([]);
});
