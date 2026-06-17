import { BaseApiClient } from './BaseApiClient';

export class UsersApiClient extends BaseApiClient {
    register(userPayload) {
        return this.post('/users/register', {
            data: userPayload,
        });
    }

    getCurrentUser(token) {
        return this.get('/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getUserById(userId, token) {
        return this.get(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    updateUser(userId, userPayload, token) {
        return this.put(`/users/${userId}`, {
            data: userPayload,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    deleteUser(userId, token) {
        const options = token
            ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            : {};

        return this.delete(`/users/${userId}`, options);
    }
}
