import { expect } from '@playwright/test';

export async function attachJson(testInfo, name, data) {
    await testInfo.attach(name, {
        body: JSON.stringify(data, null, 2),
        contentType: 'application/json',
    });
}

export function expectJsonResponse(response, expectedStatus) {
    expect(response.status()).toBe(expectedStatus);
    expect(response.headers()['content-type']).toContain('application/json');
}

export function expectObjectHasFields(object, fields) {
    for (const field of fields) {
        expect(object, `Expected response body to include "${field}"`).toHaveProperty(field);
    }
}

export function expectPaginatedResponse(body) {
    expectObjectHasFields(body, [
        'current_page',
        'data',
        'from',
        'last_page',
        'per_page',
        'to',
        'total',
    ]);
    expect(Array.isArray(body.data)).toBeTruthy();
}

export function expectProductContract(product) {
    expectObjectHasFields(product, [
        'id',
        'name',
        'description',
        'price',
        'brand',
        'category',
        'product_image',
    ]);

    expect(typeof product.id).toBe('string');
    expect(typeof product.name).toBe('string');
    expect(typeof product.description).toBe('string');
    expect(typeof product.price).toBe('number');
}

export function expectUserContract(user) {
    expectObjectHasFields(user, [
        'id',
        'first_name',
        'last_name',
        'email',
        'address',
        'phone',
        'dob',
        'created_at',
    ]);

    expect(typeof user.id).toBe('string');
    expect(typeof user.first_name).toBe('string');
    expect(typeof user.last_name).toBe('string');
    expect(typeof user.email).toBe('string');
}
