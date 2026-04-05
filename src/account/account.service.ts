import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(userId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create({
      userId,
      accountNumber: this.generateAccountNumber(),
      accountName: createAccountDto.accountName,
      bankName: createAccountDto.bankName,
      balance: createAccountDto.initialBalance || 0,
      currency: createAccountDto.currency || 'IDR',
    });
    
    return this.accountRepository.save(account);
  }

  async findAll(userId: string, isAdmin: boolean = false): Promise<Account[]> {
    if (isAdmin) {
      return this.accountRepository.find();
    }
    return this.accountRepository.find({ where: { userId } });
  }

  async findOne(id: string, userId: string, isAdmin: boolean = false): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });
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
    Object.assign(account, updateAccountDto);
    account.updatedAt = new Date();
    return this.accountRepository.save(account);
  }

  async delete(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const account = await this.findOne(id, userId, isAdmin);
    if (account.balance > 0) {
      throw new BadRequestException('Cannot delete account with positive balance');
    }
    await this.accountRepository.delete(id);
  }

  async updateBalance(id: string, amount: number): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    
    const newBalance = Number(account.balance) + amount;
    if (newBalance < 0) {
      throw new BadRequestException('Insufficient balance');
    }
    
    account.balance = newBalance;
    account.updatedAt = new Date();
    return this.accountRepository.save(account);
  }

  private generateAccountNumber(): string {
    return 'ACC' + Date.now() + Math.floor(Math.random() * 1000);
  }
}