import { expect } from '@playwright/test';

export class ProductPage {
    constructor(page) {
        this.page = page;
        this.productName = page.getByTestId('product-name');
        this.addToCartButton = page.getByTestId('add-to-cart');
    }

    async expectLoaded() {
        await expect(this.productName).toBeVisible();
        await expect(this.addToCartButton).toBeVisible();
    }

    async addToCart() {
        await Promise.all([
            this.page.waitForResponse((response) =>
                response.url().includes('/carts/') && response.status() === 200
            ),
            this.addToCartButton.click(),
        ]);
    }
}
