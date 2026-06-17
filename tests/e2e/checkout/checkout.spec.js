import { test } from '@playwright/test';
import { CartPage } from '../../../pages/Cart/CartPage';
import { CheckoutPage } from '../../../pages/Checkout/CheckoutPage';
import { HomePage } from '../../../pages/HomePage/HomePage';
import { ProductPage } from '../../../pages/Product/ProductPage';
import {
  billingAddress,
  guestCustomer,
  invalidCreditCard,
  validCreditCard,
} from '../../../data/checkoutData';

async function prepareCheckoutPayment(page) {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await homePage.goto();
  await homePage.openFirstProduct();
  await productPage.expectLoaded();
  await productPage.addToCart();

  await cartPage.openFromNavbar();
  await cartPage.expectProductInCart('Combination Pliers');
  await cartPage.proceedToCheckout();

  await checkoutPage.continueAsGuest(guestCustomer);
  await checkoutPage.fillBillingAddress(billingAddress);
  await checkoutPage.proceedToPayment();
  await checkoutPage.selectCreditCardPayment();

  return checkoutPage;
}

test.describe('Checkout E2E', () => {
  test('deve concluir checkout como guest com cartao valido', async ({ page }) => {
    const checkoutPage = await prepareCheckoutPayment(page);

    await checkoutPage.fillCreditCard(validCreditCard);
    await checkoutPage.finishOrder();

    await checkoutPage.expectPaymentSuccess();
  });

  test('deve exibir erro ao informar numero de cartao invalido', async ({ page }) => {
    const checkoutPage = await prepareCheckoutPayment(page);

    await checkoutPage.fillCreditCard(invalidCreditCard);

    await checkoutPage.expectInvalidCardNumber();
  });
});
