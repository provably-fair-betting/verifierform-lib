import { expect, test } from '@playwright/test';

const CLIENT_SEED = 'ec75fca98de6f2d9';
const SERVER_SEED = '735249f062ac025044a8523aa92e034803f02d6b75129abc97e8b1be19aab9b4';
const BLOCK_HASH = '0000000000000000000b20f796f5421cac95c4efb06c6bbf6408d6f9b5d7b9dc';

async function selectGame(page: import('@playwright/test').Page, gameName: string) {
  await page.getByRole('button', { name: /^select game:/i }).click();
  await page.getByRole('option', { name: gameName }).click();
}

test.describe('VerifierForm E2E Tests', () => {
  test('computes result for game when all required fields are given', async ({ page }) => {
    page.goto('/');

    const results = ['93.08', '0.61', '71.73'];
    const formulas = [
      'floor(0.930725325830 * 10001) / 100 = 93.08',
      'floor(0.006185348844 * 10001) / 100 = 0.61',
      'floor(0.717253545532 * 10001) / 100 = 71.73',
    ];

    const gameTrigger = page.getByRole('button', { name: /^select game:/i });
    await expect(gameTrigger).toContainText('Dice');

    const clientSeed = page.getByLabel('Client Seed*');
    await clientSeed.fill(CLIENT_SEED);

    const serverSeed = page.getByLabel('Server Seed*');
    await serverSeed.fill(SERVER_SEED);

    const nonce = page.getByLabel('Nonce*');

    for (let i = 20; i < 23; i++) {
      await nonce.clear();
      await nonce.fill(i.toString());

      const result = page.getByTestId('dice-result');
      await expect(result).toBeVisible();
      await expect(result).toContainText(results[i - 20]);

      const btn = page.getByText('Show Explanation');
      await expect(btn).toBeVisible();
      await btn.click();

      const formula = page.getByTestId('dice-formula');
      await expect(formula).toBeVisible();
      await expect(formula).toContainText(formulas[i - 20]);

      await expect(page).toHaveURL((url) => {
        return (
          url.searchParams.size === 4 &&
          url.searchParams.get('game') === 'dice' &&
          url.searchParams.get('clientseed') === CLIENT_SEED &&
          url.searchParams.get('serverseed') === SERVER_SEED &&
          url.searchParams.get('nonce') === i.toString()
        );
      });
    }
  });

  test('required fields reset when game is changed', async ({ page }) => {
    page.goto('/');

    const gameTrigger = page.getByRole('button', { name: /^select game:/i });
    await expect(gameTrigger).toContainText('Dice');

    const clientSeed = page.getByLabel('Client Seed*');
    await clientSeed.fill(CLIENT_SEED);

    const serverSeed = page.getByLabel('Server Seed*');
    await serverSeed.fill(SERVER_SEED);

    const nonce = page.getByLabel('Nonce*');
    await nonce.fill('20');

    await selectGame(page, 'Slide');

    await expect(page).toHaveURL((url) => {
      return (
        url.searchParams.size == 2 &&
        url.searchParams.get('game') === 'slide' &&
        url.searchParams.get('blockhash') === BLOCK_HASH
      );
    });
  });
});
