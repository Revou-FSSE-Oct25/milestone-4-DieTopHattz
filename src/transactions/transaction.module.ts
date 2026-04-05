import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AccountModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}