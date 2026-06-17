import { randomUUID } from 'node:crypto';

export function randomEmail(prefix = 'test.user') {
    return `${prefix}.${randomUUID()}@example.com`;
}
