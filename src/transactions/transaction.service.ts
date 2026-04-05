import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { AccountService } from '../account/account.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionService {
  private transactions: Transaction[] = [];

  constructor(private accountService: AccountService) {}

  async deposit(userId: string, depositDto: DepositDto): Promise<Transaction> {
    const account = await this.accountService.findOne(depositDto.accountId, userId);
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount: depositDto.amount,
      accountId: depositDto.accountId,
      userId,
      description: depositDto.description || 'Deposit',
      status: 'completed',
      createdAt: new Date(),
    };

    await this.accountService.updateBalance(depositDto.accountId, depositDto.amount);
    this.transactions.push(transaction);
    return transaction;
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto): Promise<Transaction> {
    const account = await this.accountService.findOne(withdrawDto.accountId, userId);
    
    if (account.balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdrawal',
      amount: withdrawDto.amount,
      accountId: withdrawDto.accountId,
      userId,
      description: withdrawDto.description || 'Withdrawal',
      status: 'completed',
      createdAt: new Date(),
    };

    await this.accountService.updateBalance(withdrawDto.accountId, -withdrawDto.amount);
    this.transactions.push(transaction);
    return transaction;
  }

  async transfer(userId: string, transferDto: TransferDto): Promise<Transaction> {
    const fromAccount = await this.accountService.findOne(transferDto.fromAccountId, userId);
    const toAccount = await this.accountService.findOne(transferDto.toAccountId, userId, true);

    if (fromAccount.balance < transferDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'transfer',
      amount: transferDto.amount,
      fromAccountId: transferDto.fromAccountId,
      toAccountId: transferDto.toAccountId,
      userId,
      description: transferDto.description || `Transfer to ${toAccount.accountName}`,
      status: 'completed',
      createdAt: new Date(),
    };

    await this.accountService.updateBalance(transferDto.fromAccountId, -transferDto.amount);
    await this.accountService.updateBalance(transferDto.toAccountId, transferDto.amount);
    this.transactions.push(transaction);
    return transaction;
  }

  async findAll(userId: string, isAdmin: boolean = false): Promise<Transaction[]> {
    if (isAdmin) {
      return this.transactions;
    }
    return this.transactions.filter(transaction => transaction.userId === userId);
  }

  async findOne(id: string, userId: string, isAdmin: boolean = false): Promise<Transaction> {
    const transaction = this.transactions.find(t => t.id === id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (!isAdmin && transaction.userId !== userId) {
      throw new ForbiddenException('You can only view your own transactions');
    }
    return transaction;
  }
}