import { Account } from '../account/account.entity';
import { Transaction } from '../transactions/transaction.entity';

export class User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  accounts?: Account[];
  transactions?: Transaction[];
}