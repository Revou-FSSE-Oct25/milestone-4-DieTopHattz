import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Account } from '../account/account.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string

  @Column({ type:'enum', enum: ['user', 'admin',], default: 'user'})
  role!: 'user' | 'admin';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];
}


// Old Code, Check Phase 1
// export class User {
//   id: string;
//   email: string;
//   password: string;
//   name: string;
//   role: 'user' | 'admin';
//   createdAt: Date;
//   updatedAt: Date;
//   accounts?: Account[];
//   transactions?: Transaction[];
// }