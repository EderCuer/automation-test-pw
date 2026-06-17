import { test, expect } from '@playwright/test';
import { ProductsApiClient } from '../../../api/clients/ProductsApiClient';
import {
    attachJson,
    expectJsonResponse,
    expectPaginatedResponse,
    expectProductContract,
} from '../../../utils/apiAssertions';

test.describe('Products API', () => {
    test.describe('GET /products', () => {
        test('deve listar os produtos com paginacao', async ({ request }, testInfo) => {
            const productsApi = new ProductsApiClient(request);

            const response = await productsApi.getProducts();
            const body = await response.json();

            await attachJson(testInfo, 'GET /products response', body);
            expectJsonResponse(response, 200);

            expectPaginatedResponse(body);
            expect(body.data.length).toBeGreaterThan(0);
            expectProductContract(body.data[0]);
        });
    });

    test.describe('GET /products/{productId}', () => {
        test('deve recuperar um produto pelo ID', async ({ request }, testInfo) => {
            const productsApi = new ProductsApiClient(request);

            const productsResponse = await productsApi.getProducts();
            const productsBody = await productsResponse.json();
            const product = productsBody.data[0];

            const response = await productsApi.getProductById(product.id);
            const body = await response.json();

            await attachJson(testInfo, `GET /products/${product.id} response`, body);
            expectJsonResponse(response, 200);

            expectProductContract(body);
            expect(body.id).toBe(product.id);
            expect(body.name).toBe(product.name);
        });

        test('deve retornar not found para um produto inexistente', async ({ request }, testInfo) => {
            const productsApi = new ProductsApiClient(request);

            const response = await productsApi.getProductById('non-existent-product-id');
            const body = await response.json();

            await attachJson(testInfo, 'GET /products/non-existent-product-id response', body);
            expectJsonResponse(response, 404);

            expect(body).toHaveProperty('message');
        });
    });

    test.describe('GET /products/search', () => {
        test('deve pesquisar produtos por query', async ({ request }, testInfo) => {
            const productsApi = new ProductsApiClient(request);

            const response = await productsApi.searchProducts('pliers');
            const body = await response.json();

            await attachJson(testInfo, 'GET /products/search?q=pliers response', body);
            expectJsonResponse(response, 200);

            expectPaginatedResponse(body);
            expect(body.data.length).toBeGreaterThan(0);
            expectProductContract(body.data[0]);
        });
    });

    test.describe('DELETE /products/{productId}', () => {
        test('deve rejeitar a exclusao de um produto sem autenticacao', async ({ request }, testInfo) => {
            const productsApi = new ProductsApiClient(request);

            const productsResponse = await productsApi.getProducts();
            const productsBody = await productsResponse.json();
            const product = productsBody.data[0];

            const response = await productsApi.deleteProduct(product.id);
            const body = await response.json();

            await attachJson(testInfo, `DELETE /products/${product.id} response`, body);
            expectJsonResponse(response, 401);

            expect(body.message).toBe('Unauthorized');
        });
    });
});
