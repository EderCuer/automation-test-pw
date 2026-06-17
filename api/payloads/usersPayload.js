import { randomUUID } from 'node:crypto';
import { randomEmail } from '../../utils/randomData';

export function buildValidUserPayload(overrides = {}) {
    const uniqueValue = randomUUID().replaceAll('-', '').slice(0, 12);

    return {
        first_name: 'Test',
        last_name: 'User',
        email: randomEmail(),
        password: `Pw@${uniqueValue}Aa1`,
        address: {
            street: 'Automation Street',
            house_number: '100',
            city: 'Test City',
            state: 'Test State',
            country: 'Test Country',
            postal_code: '12345',
        },
        phone: '11999999999',
        dob: '1990-01-01',
        ...overrides,
    };
}

export const missingRequiredUserPayload = {};
