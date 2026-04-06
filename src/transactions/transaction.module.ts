import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AccountModule } from '../account/account.module';
import { AccountService } from 'src/account/account.service';

@Module({
  imports: [AccountModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}