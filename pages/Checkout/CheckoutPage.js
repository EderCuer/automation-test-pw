import { expect } from '@playwright/test';

export class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.guestTab = page.getByRole('tab', { name: 'Continue as Guest' });
        this.guestEmailInput = page.getByTestId('guest-email');
        this.guestFirstNameInput = page.getByTestId('guest-first-name');
        this.guestLastNameInput = page.getByTestId('guest-last-name');
        this.guestSubmitButton = page.getByTestId('guest-submit');
        this.proceedAsGuestButton = page.getByTestId('proceed-2-guest');
        this.countrySelect = page.getByTestId('country');
        this.postalCodeInput = page.getByTestId('postal_code');
        this.houseNumberInput = page.getByTestId('house_number');
        this.streetInput = page.getByTestId('street');
        this.cityInput = page.getByTestId('city');
        this.stateInput = page.getByTestId('state');
        this.proceedToPaymentButton = page.getByTestId('proceed-3');
        this.paymentMethodSelect = page.getByTestId('payment-method');
        this.cardNumberInput = page.getByTestId('credit_card_number');
        this.expirationDateInput = page.getByTestId('expiration_date');
        this.cvvInput = page.getByTestId('cvv');
        this.cardHolderNameInput = page.getByTestId('card_holder_name');
        this.finishButton = page.getByTestId('finish');
    }

    async continueAsGuest(guestCustomer) {
        await this.guestTab.click();
        await this.guestEmailInput.fill(guestCustomer.email);
        await this.guestFirstNameInput.fill(guestCustomer.firstName);
        await this.guestLastNameInput.fill(guestCustomer.lastName);
        await this.guestSubmitButton.click();
        await this.proceedAsGuestButton.click();
    }

    async fillBillingAddress(address) {
        await this.countrySelect.selectOption({ label: address.country });
        await this.postalCodeInput.fill(address.postalCode);
        await this.houseNumberInput.fill(address.houseNumber);
        await this.streetInput.fill(address.street);
        await this.cityInput.fill(address.city);
        await this.stateInput.fill(address.state);
    }

    async proceedToPayment() {
        await expect(this.proceedToPaymentButton).toBeEnabled();
        await this.proceedToPaymentButton.click();
    }

    async selectCreditCardPayment() {
        await this.paymentMethodSelect.selectOption({ label: 'Credit Card' });
    }

    async fillCreditCard(card) {
        await this.cardNumberInput.fill(card.number);
        await this.expirationDateInput.fill(card.expirationDate);
        await this.cvvInput.fill(card.cvv);
        await this.cardHolderNameInput.fill(card.holderName);
    }

    async finishOrder() {
        await expect(this.finishButton).toBeEnabled();
        await this.finishButton.click();
    }

    async expectPaymentSuccess() {
        await expect(this.page.getByText('Payment was successful')).toBeVisible();
    }

    async expectInvalidCardNumber() {
        await expect(this.page.getByText('Invalid card number format.')).toBeVisible();
        await expect(this.finishButton).toBeDisabled();
    }
}
