import { expect } from '@playwright/test';

export class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.getByTestId('email');
        this.passwordInput = page.getByTestId('password');
        this.submitButton = page.getByTestId('login-submit');
        this.loginError = page.getByTestId('login-error');
    }

    async goto() {
        await this.page.goto('/auth/login');
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async submitEmptyForm() {
        await this.submitButton.click();
    }

    async expectLoginError(message) {
        await expect(this.loginError).toHaveText(message);
    }

    async expectRequiredFieldMessages() {
        await expect(this.page.getByText('Email is required')).toBeVisible();
        await expect(this.page.getByText('Password is required')).toBeVisible();
    }
}
