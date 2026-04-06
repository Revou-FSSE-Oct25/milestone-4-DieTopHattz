import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountService } from '../account/account.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private accountService: AccountService,
  ) {}

  async deposit(userId: string, depositDto: DepositDto) {
    const account = await this.accountService.findOne(depositDto.accountId, userId);
    
    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: depositDto.accountId },
        data: {
          balance: { increment: depositDto.amount },
          updatedAt: new Date(),
        },
      });

      return tx.transaction.create({
        data: {
          type: 'deposit',
          amount: depositDto.amount,
          accountId: depositDto.accountId,
          userId,
          description: depositDto.description || 'Deposit',
          status: 'completed',
        },
      });
    });
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto) {
    const account = await this.accountService.findOne(withdrawDto.accountId, userId);
    
    if (Number(account.balance) < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: withdrawDto.accountId },
        data: {
          balance: { decrement: withdrawDto.amount },
          updatedAt: new Date(),
        },
      });

      return tx.transaction.create({
        data: {
          type: 'withdrawal',
          amount: withdrawDto.amount,
          accountId: withdrawDto.accountId,
          userId,
          description: withdrawDto.description || 'Withdrawal',
          status: 'completed',
        },
      });
    });
  }

  async transfer(userId: string, transferDto: TransferDto) {
    const fromAccount = await this.accountService.findOne(transferDto.fromAccountId, userId);
    const toAccount = await this.accountService.findOne(transferDto.toAccountId, userId, true);

    if (Number(fromAccount.balance) < transferDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: transferDto.fromAccountId },
        data: {
          balance: { decrement: transferDto.amount },
          updatedAt: new Date(),
        },
      });

      await tx.account.update({
        where: { id: transferDto.toAccountId },
        data: {
          balance: { increment: transferDto.amount },
          updatedAt: new Date(),
        },
      });

      return tx.transaction.create({
        data: {
          type: 'transfer',
          amount: transferDto.amount,
          fromAccountId: transferDto.fromAccountId,
          toAccountId: transferDto.toAccountId,
          userId,
          description: transferDto.description || `Transfer to ${toAccount.accountName}`,
          status: 'completed',
        },
      });
    });
  }

  async findAll(userId: string, isAdmin: boolean = false) {
    if (isAdmin) {
      return this.prisma.transaction.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          account: true,
          fromAccount: true,
          toAccount: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        account: true,
        fromAccount: true,
        toAccount: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, isAdmin: boolean = false) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        account: true,
        fromAccount: true,
        toAccount: true,
      },
    });
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    
    if (!isAdmin && transaction.userId !== userId) {
      throw new ForbiddenException('You can only view your own transactions');
    }
    
    return transaction;
  }
}