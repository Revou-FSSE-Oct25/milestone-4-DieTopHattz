import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAccountDto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        userId,
        accountNumber: this.generateAccountNumber(),
        accountName: createAccountDto.accountName,
        bankName: createAccountDto.bankName,
        balance: createAccountDto.initialBalance || 0,
        currency: createAccountDto.currency || 'IDR',
      },
    });
  }

  async findAll(userId: string, isAdmin: boolean = false) {
    if (isAdmin) {
      return this.prisma.account.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, isAdmin: boolean = false) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    
    if (!isAdmin && account.userId !== userId) {
      throw new ForbiddenException('You can only access your own accounts');
    }
    
    return account;
  }

  async update(id: string, userId: string, updateAccountDto: UpdateAccountDto, isAdmin: boolean = false) {
    await this.findOne(id, userId, isAdmin);
    
    return this.prisma.account.update({
      where: { id },
      data: {
        ...updateAccountDto,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string, userId: string, isAdmin: boolean = false) {
    const account = await this.findOne(id, userId, isAdmin);
    
    if (account.balance > 0) {
      throw new BadRequestException('Cannot delete account with positive balance');
    }
    
    await this.prisma.account.delete({
      where: { id },
    });
  }

  async updateBalance(id: string, amount: number) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });
    
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    
    const newBalance = Number(account.balance) + amount;
    if (newBalance < 0) {
      throw new BadRequestException('Insufficient balance');
    }
    
    return this.prisma.account.update({
      where: { id },
      data: {
        balance: newBalance,
        updatedAt: new Date(),
      },
    });
  }

  private generateAccountNumber(): string {
    return 'ACC' + Date.now() + Math.floor(Math.random() * 1000);
  }
}