import { expect } from '@playwright/test';

export class CartPage {
    constructor(page) {
        this.page = page;
        this.navCart = page.getByTestId('nav-cart');
        this.cartQuantity = page.getByTestId('cart-quantity');
        this.productTitle = page.getByTestId('product-title');
        this.proceedToCheckoutButton = page.getByTestId('proceed-1');
    }

    async openFromNavbar() {
        await this.navCart.click();
    }

    async expectProductInCart(productName) {
        await expect(this.productTitle).toContainText(productName);
        await expect(this.cartQuantity).toHaveText('1');
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }
}
