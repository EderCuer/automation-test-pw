export const guestCustomer = {
    email: 'guest@example.com',
    firstName: 'Guest',
    lastName: 'User',
};

export const billingAddress = {
    country: 'Brazil',
    postalCode: '12345',
    houseNumber: '100',
    street: 'Automation Street',
    city: 'Sao Paulo',
    state: 'SP',
};

export const validCreditCard = {
    number: '4242-4242-4242-4242',
    expirationDate: '12/2030',
    cvv: '123',
    holderName: 'Guest User',
};

export const invalidCreditCard = {
    ...validCreditCard,
    number: '4242424242424242',
};
