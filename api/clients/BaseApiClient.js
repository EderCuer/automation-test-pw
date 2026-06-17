import { API_BASE_URL } from '../../utils/env';

export class BaseApiClient {
    constructor(request, baseUrl = API_BASE_URL) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    buildUrl(path) {
        return `${this.baseUrl}${path}`;
    }

    get(path, options = {}) {
        return this.request.get(this.buildUrl(path), options);
    }

    post(path, options = {}) {
        return this.request.post(this.buildUrl(path), options);
    }

    put(path, options = {}) {
        return this.request.put(this.buildUrl(path), options);
    }

    delete(path, options = {}) {
        return this.request.delete(this.buildUrl(path), options);
    }
}
