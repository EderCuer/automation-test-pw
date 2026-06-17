import { test } from '@playwright/test';
import { UsersApiClient } from '../../../api/clients/UsersApiClient';
import { buildValidUserPayload } from '../../../api/payloads/usersPayload';
import { HomePage } from '../../../pages/HomePage/HomePage';
import { LoginPage } from '../../../pages/Login/LoginPage';

test.describe('Login E2E', () => {
    test('deve realizar login com credenciais válidas', async ({ page, request }) => {
        const usersApi = new UsersApiClient(request);
        const user = buildValidUserPayload();
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await usersApi.register(user);
        await loginPage.goto();
        await loginPage.login(user.email, user.password);

        await homePage.expectLoggedInAs(`${user.first_name} ${user.last_name}`);
    });

    test('deve exibir erro para senha inválida', async ({ page, request }) => {
        const usersApi = new UsersApiClient(request);
        const user = buildValidUserPayload();
        const loginPage = new LoginPage(page);

        await usersApi.register(user);
        await loginPage.goto();
        await loginPage.login(user.email, 'WrongPassword@123');

        await loginPage.expectLoginError('Invalid email or password');
    });

    test('deve validar campos obrigatórios em branco', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.submitEmptyForm();

        await loginPage.expectRequiredFieldMessages();
    });
});
