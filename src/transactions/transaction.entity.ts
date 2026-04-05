import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Account } from '../account/account.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: ['deposit', 'withdrawal', 'transfer'] })
  type!: 'deposit' | 'withdrawal' | 'transfer';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ nullable: true })
  fromAccountId!: string;

  @Column({ nullable: true })
  toAccountId!: string;

  @Column({ nullable: true })
  accountId!: string;

  @Column()
  userId!: string;

  @Column()
  description?: string;

  @Column({ type: 'enum', enum: ['pending', 'completed', 'failed'], default: 'completed' })
  status!: 'pending' | 'completed' | 'failed';

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: 'accountId' })
  account!: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'fromAccountId' })
  fromAccount!: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'toAccountId' })
  toAccount!: Account;
}











// export class Transaction {
//   id: string;
//   type: 'deposit' | 'withdrawal' | 'transfer';
//   amount: number;
//   fromAccountId?: string;
//   toAccountId?: string;
//   accountId?: string;
//   userId: string;
//   description: string;
//   status: 'pending' | 'completed' | 'failed';
//   createdAt: Date;
// }