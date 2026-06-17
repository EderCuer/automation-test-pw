import { expect } from '@playwright/test';

export class HomePage {
    constructor(page) {
        this.page = page;
        this.signInLink = page.getByTestId('nav-sign-in');
        this.accountMenu = page.getByTestId('nav-menu');
        this.firstProductCard = page.locator('[data-test^="product-"]').first();
    }

    async goto() {
        await this.page.goto('/');
    }

    async openFirstProduct() {
        await this.firstProductCard.click();
    }

    async expectLoggedInAs(customerName) {
        await expect(this.page).toHaveURL(/\/account$/);
        await expect(this.page.getByText('My account').first()).toBeVisible();
        await expect(this.accountMenu).toContainText(customerName);
    }
}
