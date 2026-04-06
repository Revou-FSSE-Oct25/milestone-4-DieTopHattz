import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { accounts: true, transactions: true },
        },
      },
    });
    
    return {
      success: true,
      count: users.length,
      data: users,
    };
  }

  @Get('accounts')
  async getAllAccounts() {
    const accounts = await this.prisma.account.findMany({
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
    
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    
    return {
      success: true,
      count: accounts.length,
      totalBalance,
      data: accounts,
    };
  }

  @Get('transactions')
  async getAllTransactions() {
    const transactions = await this.prisma.transaction.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        account: true,
        fromAccount: true,
        toAccount: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    
    return {
      success: true,
      count: transactions.length,
      data: transactions,
    };
  }

  @Get('dashboard')
  async getDashboard() {
    const [totalUsers, totalAccounts, totalTransactions, accounts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.account.count(),
      this.prisma.transaction.count(),
      this.prisma.account.findMany(),
    ]);
    
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    
    return {
      success: true,
      stats: {
        totalUsers,
        totalAccounts,
        totalTransactions,
        totalBalance,
      },
      timestamp: new Date(),
    };
  }
}