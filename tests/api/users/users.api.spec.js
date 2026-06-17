import { test, expect } from '@playwright/test';
import { AuthApiClient } from '../../../api/clients/AuthApiClient';
import { UsersApiClient } from '../../../api/clients/UsersApiClient';
import {
    buildValidUserPayload,
    missingRequiredUserPayload,
} from '../../../api/payloads/usersPayload';
import {
    attachJson,
    expectJsonResponse,
    expectUserContract,
} from '../../../utils/apiAssertions';

test.describe('Users API', () => {
    test.describe('POST /users/register', () => {
        test('deve cadastrar um novo usuario com dados validos', async ({ request }, testInfo) => {
            const usersApi = new UsersApiClient(request);
            const userPayload = buildValidUserPayload();

            const response = await usersApi.register(userPayload);
            const body = await response.json();

            await attachJson(testInfo, 'POST /users/register response', body);
            expectJsonResponse(response, 201);

            expectUserContract(body);
            expect(body.email).toBe(userPayload.email);
            expect(body.first_name).toBe(userPayload.first_name);
            expect(body.last_name).toBe(userPayload.last_name);
        });

        test('deve rejeitar cadastro com campos obrigatorios ausentes', async ({ request }, testInfo) => {
            const usersApi = new UsersApiClient(request);

            const response = await usersApi.register(missingRequiredUserPayload);
            const body = await response.json();

            await attachJson(testInfo, 'POST /users/register missing required fields response', body);
            expectJsonResponse(response, 422);

            expect(body).toHaveProperty('first_name');
            expect(body).toHaveProperty('last_name');
            expect(body).toHaveProperty('email');
            expect(body).toHaveProperty('password');
        });

        test('deve rejeitar cadastro com email duplicado', async ({ request }, testInfo) => {
            const usersApi = new UsersApiClient(request);
            const userPayload = buildValidUserPayload();

            await usersApi.register(userPayload);
            const response = await usersApi.register(userPayload);
            const body = await response.json();

            await attachJson(testInfo, 'POST /users/register duplicated email response', body);
            expectJsonResponse(response, 409);

            expect(body).toHaveProperty('email');
        });
    });

    test.describe('POST /users/login', () => {
        test('deve fazer login com credenciais validas', async ({ request }, testInfo) => {
            const authApi = new AuthApiClient(request);
            const usersApi = new UsersApiClient(request);
            const userPayload = buildValidUserPayload();

            await usersApi.register(userPayload);

            const response = await authApi.login({
                email: userPayload.email,
                password: userPayload.password,
            });
            const body = await response.json();

            await attachJson(testInfo, 'POST /users/login response', body);
            expectJsonResponse(response, 200);

            expect(body).toHaveProperty('access_token');
            expect(body).toHaveProperty('token_type', 'bearer');
            expect(body).toHaveProperty('expires_in');
            expect(typeof body.access_token).toBe('string');
        });

        test('deve rejeitar login com senha invalida', async ({ request }, testInfo) => {
            const authApi = new AuthApiClient(request);
            const usersApi = new UsersApiClient(request);
            const userPayload = buildValidUserPayload();

            await usersApi.register(userPayload);

            const response = await authApi.login({
                email: userPayload.email,
                password: 'WrongPassword@123',
            });
            const body = await response.json();

            await attachJson(testInfo, 'POST /users/login invalid response', body);
            expectJsonResponse(response, 401);

            expect(body).toHaveProperty('error', 'Unauthorized');
        });
    });

    test.describe('PUT /users/{userId}', () => {
        test('deve atualizar um usuario autenticado', async ({ request }, testInfo) => {
            const authApi = new AuthApiClient(request);
            const usersApi = new UsersApiClient(request);
            const userPayload = buildValidUserPayload();
            const updatedUserPayload = {
                ...userPayload,
                first_name: 'Updated',
                last_name: 'User',
            };

            const registerResponse = await usersApi.register(userPayload);
            const registeredUser = await registerResponse.json();

            const loginResponse = await authApi.login({
                email: userPayload.email,
                password: userPayload.password,
            });
            const { access_token: token } = await loginResponse.json();

            const response = await usersApi.updateUser(
                registeredUser.id,
                updatedUserPayload,
                token
            );
            const body = await response.json();

            await attachJson(testInfo, `PUT /users/${registeredUser.id} response`, body);
            expectJsonResponse(response, 200);

            expect(body).toHaveProperty('success', true);
        });
    });

    test.describe('DELETE /users/{userId}', () => {
        test('deve rejeitar a exclusao de um usuario sem autenticacao', async ({ request }, testInfo) => {
            const usersApi = new UsersApiClient(request);

            const response = await usersApi.deleteUser('non-existent-user-id');
            const body = await response.json();

            await attachJson(testInfo, 'DELETE /users/non-existent-user-id response', body);
            expectJsonResponse(response, 401);

            expect(body).toHaveProperty('message', 'Unauthorized');
        });
    });
});
