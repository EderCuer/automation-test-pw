import { BaseApiClient } from './BaseApiClient';

export class AuthApiClient extends BaseApiClient {
   login(credentials) {
      return this.post('/users/login', {
         data: credentials,
      });
   }
}
