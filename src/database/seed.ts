import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { Account } from '../account/account.entity';
import { Transaction } from '../transactions/transaction.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('\n🚀 Starting Database Seeding...\n');

// Create database connection
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Account, Transaction],
  synchronize: true,
});

async function seed() {
  try {
    // 1. Connect to database
    console.log('📡 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    // 2. Clear existing data
    console.log('🗑️  Clearing existing data...');
    
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const accountRepo = AppDataSource.getRepository(Account);
    const userRepo = AppDataSource.getRepository(User);
    
    // Check if tables have data before trying to delete
    const transactionCount = await transactionRepo.count();
    const accountCount = await accountRepo.count();
    const userCount = await userRepo.count();
    
    if (transactionCount > 0) {
      await transactionRepo.delete({});
      console.log('   ✓ Transactions cleared');
    } else {
      console.log('   ℹ️  No transactions to clear');
    }
    
    if (accountCount > 0) {
      await accountRepo.delete({});
      console.log('   ✓ Accounts cleared');
    } else {
      console.log('   ℹ️  No accounts to clear');
    }
    
    if (userCount > 0) {
      await userRepo.delete({});
      console.log('   ✓ Users cleared');
    } else {
      console.log('   ℹ️  No users to clear');
    }
    console.log('');

    // 3. Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 4. Create Users
    console.log('👥 Creating users...');

    const john = await userRepo.save({
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'user',
    });

    const jane = await userRepo.save({
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'user',
    });

    const admin = await userRepo.save({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    });

    console.log(`   ✓ Created ${await userRepo.count()} users`);
    console.log(`     - ${john.name} (${john.email})`);
    console.log(`     - ${jane.name} (${jane.email})`);
    console.log(`     - ${admin.name} (${admin.email})\n`);

    // 5. Create Accounts
    console.log('💰 Creating accounts...');

    // John's accounts
    const johnSavings = await accountRepo.save({
      userId: john.id,
      accountNumber: 'ACC1001',
      accountName: 'Savings Account',
      bankName: 'Bank Mandiri',
      balance: 5000000,
      currency: 'IDR',
    });

    const johnChecking = await accountRepo.save({
      userId: john.id,
      accountNumber: 'ACC1002',
      accountName: 'Checking Account',
      bankName: 'BCA',
      balance: 2500000,
      currency: 'IDR',
    });

    // Jane's account
    const janeBusiness = await accountRepo.save({
      userId: jane.id,
      accountNumber: 'ACC2001',
      accountName: 'Business Account',
      bankName: 'Bank BNI',
      balance: 10000000,
      currency: 'IDR',
    });

    console.log(`   ✓ Created ${await accountRepo.count()} accounts\n`);

    // 6. Create Transactions
    console.log('💸 Creating transactions...');

    // Deposits
    await transactionRepo.save({
      type: 'deposit',
      amount: 1000000,
      accountId: johnSavings.id,
      userId: john.id,
      description: 'Salary deposit',
      status: 'completed',
    });

    await transactionRepo.save({
      type: 'deposit',
      amount: 5000000,
      accountId: janeBusiness.id,
      userId: jane.id,
      description: 'Client payment',
      status: 'completed',
    });

    // Withdrawal
    await transactionRepo.save({
      type: 'withdrawal',
      amount: 200000,
      accountId: johnChecking.id,
      userId: john.id,
      description: 'ATM withdrawal',
      status: 'completed',
    });

    // Transfer
    await transactionRepo.save({
      type: 'transfer',
      amount: 300000,
      fromAccountId: johnSavings.id,
      toAccountId: janeBusiness.id,
      userId: john.id,
      description: 'Payment to Jane',
      status: 'completed',
    });

    console.log(`   ✓ Created ${await transactionRepo.count()} transactions\n`);

    // 7. Update balances after transfer
    await accountRepo.update(johnSavings.id, { balance: 4700000 });
    await accountRepo.update(janeBusiness.id, { balance: 10300000 });

    // 8. Display final balances
    console.log('📊 Final Account Balances:');
    console.log('=================================');
    
    const allAccounts = await accountRepo.find({
      relations: ['user'],
    });

    for (const acc of allAccounts) {
      console.log(`${acc.user.name} - ${acc.accountName}: Rp ${acc.balance.toLocaleString()}`);
    }

    // 9. Summary
    console.log('\n✅ ===================================');
    console.log('✅ SEEDING COMPLETED SUCCESSFULLY!');
    console.log('✅ ===================================');
    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${await userRepo.count()}`);
    console.log(`   Accounts: ${await accountRepo.count()}`);
    console.log(`   Transactions: ${await transactionRepo.count()}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('   ┌─────────────────────────────────┐');
    console.log('   │ Email                  | Password│');
    console.log('   ├─────────────────────────────────┤');
    console.log('   │ john@example.com       | password123 │');
    console.log('   │ jane@example.com       | password123 │');
    console.log('   │ admin@example.com      | password123 │');
    console.log('   └─────────────────────────────────┘');

} catch (error: unknown) {
    console.error('\n❌ Seeding failed:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
        console.error('\n📋 Error details:', error.stack);
    }
} finally {
    await AppDataSource.destroy();
    console.log('\n📡 Database connection closed\n');
}
}

// Run the seed function
seed();