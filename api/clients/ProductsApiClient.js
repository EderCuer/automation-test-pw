import { BaseApiClient } from './BaseApiClient';

export class ProductsApiClient extends BaseApiClient {
    getProducts(params = {}) {
        return this.get('/products', { params });
    }

    getProductById(productId) {
        return this.get(`/products/${productId}`);
    }

    searchProducts(query) {
        return this.get('/products/search', {
            params: { q: query },
        });
    }

    deleteProduct(productId, options = {}) {
        return this.delete(`/products/${productId}`, options);
    }
}
