import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../../pages/Login/LoginPage';

test.describe('Accessibility', () => {
    test('deve validar acessibilidade crítica da tela de login', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .exclude('[data-test="chat-toggle"]')
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
