export class Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  fromAccountId?: string;
  toAccountId?: string;
  accountId?: string;
  userId: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}