import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { AccountService } from '../account/account.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private accountService: AccountService,
  ) {}

  async deposit(userId: string, depositDto: DepositDto): Promise<Transaction> {
    const account = await this.accountService.findOne(depositDto.accountId, userId);
    
    const transaction = this.transactionRepository.create({
      type: 'deposit',
      amount: depositDto.amount,
      accountId: depositDto.accountId,
      userId,
      description: depositDto.description || 'Deposit',
      status: 'completed',
    });

    await this.accountService.updateBalance(depositDto.accountId, depositDto.amount);
    return this.transactionRepository.save(transaction);
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto): Promise<Transaction> {
    const account = await this.accountService.findOne(withdrawDto.accountId, userId);
    
    if (account.balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction = this.transactionRepository.create({
      type: 'withdrawal',
      amount: withdrawDto.amount,
      accountId: withdrawDto.accountId,
      userId,
      description: withdrawDto.description || 'Withdrawal',
      status: 'completed',
    });

    await this.accountService.updateBalance(withdrawDto.accountId, -withdrawDto.amount);
    return this.transactionRepository.save(transaction);
  }

  async transfer(userId: string, transferDto: TransferDto): Promise<Transaction> {
    const fromAccount = await this.accountService.findOne(transferDto.fromAccountId, userId);
    const toAccount = await this.accountService.findOne(transferDto.toAccountId, userId, true);

    if (fromAccount.balance < transferDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction = this.transactionRepository.create({
      type: 'transfer',
      amount: transferDto.amount,
      fromAccountId: transferDto.fromAccountId,
      toAccountId: transferDto.toAccountId,
      userId,
      description: transferDto.description || `Transfer to ${toAccount.accountName}`,
      status: 'completed',
    });

    await this.accountService.updateBalance(transferDto.fromAccountId, -transferDto.amount);
    await this.accountService.updateBalance(transferDto.toAccountId, transferDto.amount);
    return this.transactionRepository.save(transaction);
  }

  async findAll(userId: string, isAdmin: boolean = false): Promise<Transaction[]> {
    if (isAdmin) {
      return this.transactionRepository.find({
        order: { createdAt: 'DESC' },
      });
    }
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string, isAdmin: boolean = false): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ where: { id } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (!isAdmin && transaction.userId !== userId) {
      throw new ForbiddenException('You can only view your own transactions');
    }
    return transaction;
  }
}