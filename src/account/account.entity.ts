import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ unique: true })
  accountNumber!: string;

  @Column()
  accountName!: string;

  @Column()
  bankName!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance!: number;

  @Column({ default: 'IDR' })
  currency!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[];
}





// Old Code, Check Phase 1 
// export class Account {
//   id: string;
//   userId: string;
//   accountNumber: string;
//   accountName: string;
//   bankName: string;
//   balance: number;
//   currency: string;
//   createdAt: Date;
//   updatedAt: Date;
// }