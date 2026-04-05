import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  private accounts: Account[] = [];

  async create(userId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    const account: Account = {
      id: Date.now().toString(),
      userId,
      accountNumber: this.generateAccountNumber(),
      accountName: createAccountDto.accountName,
      bankName: createAccountDto.bankName,
      balance: createAccountDto.initialBalance || 0,
      currency: createAccountDto.currency || 'IDR',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.accounts.push(account);
    return account;
  }

  async findAll(userId: string, isAdmin: boolean = false): Promise<Account[]> {
    if (isAdmin) {
      return this.accounts;
    }
    return this.accounts.filter(account => account.userId === userId);
  }

  async findOne(id: string, userId: string, isAdmin: boolean = false): Promise<Account> {
    const account = this.accounts.find(acc => acc.id === id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (!isAdmin && account.userId !== userId) {
      throw new ForbiddenException('You can only access your own accounts');
    }
    return account;
  }

  async update(id: string, userId: string, updateAccountDto: UpdateAccountDto, isAdmin: boolean = false): Promise<Account> {
    const account = await this.findOne(id, userId, isAdmin);
    const updatedAccount = {
      ...account,
      ...updateAccountDto,
      updatedAt: new Date(),
    };
    const index = this.accounts.findIndex(acc => acc.id === id);
    this.accounts[index] = updatedAccount;
    return updatedAccount;
  }

  async delete(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const account = await this.findOne(id, userId, isAdmin);
    if (account.balance > 0) {
      throw new BadRequestException('Cannot delete account with positive balance');
    }
    const index = this.accounts.findIndex(acc => acc.id === id);
    this.accounts.splice(index, 1);
  }

  async updateBalance(id: string, amount: number): Promise<Account> {
    const account = this.accounts.find(acc => acc.id === id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const newBalance = account.balance + amount;
    if (newBalance < 0) {
      throw new BadRequestException('Insufficient balance');
    }
    account.balance = newBalance;
    account.updatedAt = new Date();
    return account;
  }

  private generateAccountNumber(): string {
    return 'ACC' + Date.now() + Math.floor(Math.random() * 1000);
  }
}