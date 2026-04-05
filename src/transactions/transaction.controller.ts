import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  async deposit(@GetUser() user, @Body() depositDto: DepositDto) {
    return this.transactionService.deposit(user.id, depositDto);
  }

  @Post('withdraw')
  async withdraw(@GetUser() user, @Body() withdrawDto: WithdrawDto) {
    return this.transactionService.withdraw(user.id, withdrawDto);
  }

  @Post('transfer')
  async transfer(@GetUser() user, @Body() transferDto: TransferDto) {
    return this.transactionService.transfer(user.id, transferDto);
  }

  @Get()
  async findAll(@GetUser() user) {
    const isAdmin = user.role === 'admin';
    return this.transactionService.findAll(user.id, isAdmin);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user) {
    const isAdmin = user.role === 'admin';
    return this.transactionService.findOne(id, user.id, isAdmin);
  }
}