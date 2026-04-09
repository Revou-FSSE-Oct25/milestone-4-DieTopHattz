<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">Banking API with authentication, account management, and transaction processing. Built with NestJS, PostgreSQL, and Prisma ORM.</p>

## Features

- 🔐 **Authentication**: JWT with refresh tokens
- 👥 **Role-Based Access**: Admin and User roles
- 💰 **Account Management**: Create, read, update, delete bank accounts
- 💸 **Transactions**: Deposits, withdrawals, and transfers
- 🛡️ **Security**: Account lockout (5 failed attempts), rate limiting, Helmet security headers
- 📊 **Admin Dashboard**: View all users, accounts, and transactions

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | NestJS 11 |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Authentication | JWT with refresh tokens |
| Security | Helmet, bcrypt, Rate limiting |
| Language | TypeScript |

## Test Credentials

After seeding the database, you can use these test accounts:

| Email | Password | Role |
|-------|----------|------|
| john@example.com | password123 | User |
| jane@example.com | password123 | User |
| bob@example.com | password123 | User |
| admin@example.com | password123 | Admin |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout and invalidate refresh token |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PATCH | `/api/user/profile` | Update user profile |

### Accounts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts` | Create a bank account |
| GET | `/api/accounts` | List user's accounts |
| GET | `/api/accounts/:id` | Get account by ID |
| PATCH | `/api/accounts/:id` | Update account |
| DELETE | `/api/accounts/:id` | Delete account (balance must be 0) |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/deposit` | Deposit money |
| POST | `/api/transactions/withdraw` | Withdraw money |
| POST | `/api/transactions/transfer` | Transfer between accounts |
| GET | `/api/transactions` | Get transaction history |
| GET | `/api/transactions/:id` | Get transaction details |

### Admin (Admin role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/accounts` | Get all accounts |
| GET | `/api/admin/transactions` | Get all transactions |
| GET | `/api/admin/dashboard` | System statistics |

## Project Setup

```bash
# Install dependencies
$ pnpm install

# Generate Prisma client
$ pnpm prisma generate

# Run database migrations
$ pnpm prisma migrate dev

# Seed the database with test data
$ pnpm seed

## Compile and Run the Project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```