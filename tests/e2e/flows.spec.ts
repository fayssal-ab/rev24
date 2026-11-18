import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('1. changer la langue → tout le cours change', async ({ page }) => {
  await page.goto('/#/m/linux/c/users');
  const h1 = page.locator('h1');
  await expect(h1).toContainText('Utilisateurs, groupes et droits');
  await expect(page.locator('nav[aria-label]').last()).toContainText('Cours');
  await page.getByTestId('lang-dar').click();
  await expect(h1).toContainText('Users, groupes w droits');
  await expect(page.locator('main')).toContainText('Anwa3 comptes w groupes');
  await expect(page.locator('nav[aria-label]').last()).toContainText('Dars');
  await page.getByTestId('lang-en').click();
  await expect(h1).toContainText('Users, groups and permissions');
  await expect(page.locator('main')).toContainText('Account types and groups');
  // the choice is remembered
  await page.reload();
  await expect(page.locator('h1')).toContainText('Users, groups and permissions');
});

async function answer(page: Page, right: boolean) {
  const q = page.getByTestId('question');
  const input = q.getByTestId('answer-input');
  if (await input.count()) {
    await input.fill('mauvaise réponse');
  } else {
    const opts = q.locator(`[data-correct="${right}"]`);
    const n = await opts.count();
    if (right) for (let i = 0; i < n; i++) await opts.nth(i).click();
    else await opts.first().click();
  }
  await page.getByTestId('validate').click();
  await expect(page.getByTestId('feedback')).toBeVisible();
}

test('2. QCM faux puis juste → sort de « Mes erreurs » après 3 réussites', async ({ page }) => {
  // find a choice question (single or multi)
  let qid = '';
  for (let attempt = 0; attempt < 15 && !qid; attempt++) {
    await page.goto('/#/');
    await page.goto('/#/m/linux/qcm');
    await page.getByTestId('start-qcm').click();
    const q = page.getByTestId('question');
    await expect(q).toBeVisible();
    if ((await q.locator('[data-correct]').count()) > 0) qid = (await q.getAttribute('data-qid')) ?? '';
  }
  expect(qid).not.toBe('');
  await answer(page, false);
  await expect(page.getByTestId('feedback')).toContainText(/Pas tout à fait/);

  await page.goto('/#/');
  await page.goto('/#/m/linux/qcm');
  await expect(page.getByTestId('mistakes-tab')).toContainText('(1)');
  await page.getByTestId('mistakes-tab').click();
  await page.getByTestId('start-qcm').click();
  for (let i = 0; i < 3; i++) {
    await expect(page.getByTestId('question')).toHaveAttribute('data-qid', qid);
    await answer(page, true);
    await expect(page.getByTestId('feedback')).toContainText(/Bonne réponse/);
    await page.getByTestId('next').click();
  }
  await expect(page.getByTestId('quiz-finished')).toBeVisible();
  await page.goto('/#/');
  await page.goto('/#/m/linux/qcm');
  await expect(page.getByTestId('mistakes-tab')).toContainText('(0)');
});

test('3. mission terminal TP5 /opt/donnees validée', async ({ page }) => {
  await page.goto('/#/terminal?mission=m-tp5-donnees');
  const input = page.getByTestId('terminal-input');
  await expect(input).toBeVisible();
  await expect(page.getByTestId('mission-done')).toHaveCount(0);
  for (const c of ['mkdir /opt/donnees', 'chown tp /opt/donnees', 'chmod 755 /opt/donnees', 'chgrp IIR /opt/donnees', 'ls -ld /opt/donnees']) {
    await input.fill(c);
    await input.press('Enter');
  }
  await expect(page.getByTestId('terminal')).toContainText('drwxr-xr-x. 2 tp IIR');
  await expect(page.locator('[data-testid="objectives"] li[data-ok="true"]')).toHaveCount(3);
  await expect(page.getByTestId('mission-done')).toBeVisible();
  // persisted as completed
  await page.goto('/#/terminal');
  await expect(page.getByTestId('mission-m-tp5-donnees')).toBeVisible();
});

test('4. démarrer le mode 24h et terminer un bloc', async ({ page }) => {
  await page.goto('/#/24h');
  await page.getByTestId('r24-start').click();
  await expect(page.getByTestId('r24-diagnostic')).toBeVisible();
  for (let i = 0; i < 14; i++) await page.getByTestId('diag-next').click();
  await page.getByTestId('diag-finish').click();
  await expect(page.getByTestId('r24-plan')).toBeVisible();
  await expect(page.locator('li[data-kind="sleep"]')).toHaveCount(1);
  await expect(page.locator('li[data-kind="study"]').first()).toBeVisible();
  const current = page.getByTestId('r24-current');
  await expect(current).toBeVisible();
  await page.getByTestId('r24-done').click();
  await expect(page.locator('li[data-kind] span.bg-ok').first()).toBeVisible();
  // the plan survives a reload
  await page.reload();
  await expect(page.getByTestId('r24-plan')).toBeVisible();
  await expect(page.locator('li[data-kind] span.bg-ok').first()).toBeVisible();
});
