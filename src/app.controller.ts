import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'Banking API is running',
      version: '1.0.0',
      endpoints: {
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
        },
        user: {
          profile: 'GET /api/user/profile',
          update: 'PATCH /api/user/profile',
        },
        accounts: {
          create: 'POST /api/accounts',
          list: 'GET /api/accounts',
          get: 'GET /api/accounts/:id',
          update: 'PATCH /api/accounts/:id',
          delete: 'DELETE /api/accounts/:id',
        },
        transactions: {
          deposit: 'POST /api/transactions/deposit',
          withdraw: 'POST /api/transactions/withdraw',
          transfer: 'POST /api/transactions/transfer',
          list: 'GET /api/transactions',
          get: 'GET /api/transactions/:id',
        },
      },
    };
  }
}