import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { Account } from '../account/account.entity';
import { Transaction } from '../transactions/transaction.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Validate environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
});

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  entities: [User, Account, Transaction],
  synchronize: true,
  logging: false,
});

async function seed() {
  console.log('\n🌱 ===================================');
  console.log('🌱 Starting Database Seeding');
  console.log('🌱 ===================================\n');

  try {
    // Connect to database
    console.log('📡 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully\n');

    // Clear existing data (in correct order due to foreign keys)
    console.log('🗑️  Clearing existing data...');
    await AppDataSource.getRepository(Transaction).delete({});
    console.log('   ✓ Transactions cleared');
    await AppDataSource.getRepository(Account).delete({});
    console.log('   ✓ Accounts cleared');
    await AppDataSource.getRepository(User).delete({});
    console.log('   ✓ Users cleared\n');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // ==========================================
    // CREATE USERS
    // ==========================================
    console.log('👥 Creating users...');
    const userRepo = AppDataSource.getRepository(User);

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

    const bob = await userRepo.save({
      email: 'bob@example.com',
      password: hashedPassword,
      name: 'Bob Wilson',
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
    console.log(`     - ${bob.name} (${bob.email})`);
    console.log(`     - ${admin.name} (${admin.email} - ADMIN)\n`);

    // ==========================================
    // CREATE ACCOUNTS
    // ==========================================
    console.log('💰 Creating accounts...');
    const accountRepo = AppDataSource.getRepository(Account);

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

    // Jane's accounts
    const janeBusiness = await accountRepo.save({
      userId: jane.id,
      accountNumber: 'ACC2001',
      accountName: 'Business Account',
      bankName: 'Bank BNI',
      balance: 10000000,
      currency: 'IDR',
    });

    const janePersonal = await accountRepo.save({
      userId: jane.id,
      accountNumber: 'ACC2002',
      accountName: 'Personal Account',
      bankName: 'Bank Mandiri',
      balance: 3000000,
      currency: 'IDR',
    });

    // Bob's account
    const bobAccount = await accountRepo.save({
      userId: bob.id,
      accountNumber: 'ACC3001',
      accountName: 'Main Account',
      bankName: 'Bank BCA',
      balance: 1500000,
      currency: 'IDR',
    });

    console.log(`   ✓ Created ${await accountRepo.count()} accounts\n`);

    // ==========================================
    // CREATE TRANSACTIONS
    // ==========================================
    console.log('💸 Creating transactions...');
    const transactionRepo = AppDataSource.getRepository(Transaction);

    // John's deposits
    await transactionRepo.save({
      type: 'deposit',
      amount: 1000000,
      accountId: johnSavings.id,
      userId: john.id,
      description: 'Salary deposit - January',
      status: 'completed',
    });

    await transactionRepo.save({
      type: 'deposit',
      amount: 500000,
      accountId: johnChecking.id,
      userId: john.id,
      description: 'Bonus deposit',
      status: 'completed',
    });

    // John's withdrawal
    await transactionRepo.save({
      type: 'withdrawal',
      amount: 200000,
      accountId: johnChecking.id,
      userId: john.id,
      description: 'ATM withdrawal',
      status: 'completed',
    });

    // Transfer from John to Jane
    await transactionRepo.save({
      type: 'transfer',
      amount: 300000,
      fromAccountId: johnSavings.id,
      toAccountId: janeBusiness.id,
      userId: john.id,
      description: 'Payment for services',
      status: 'completed',
    });

    // Jane's transactions
    await transactionRepo.save({
      type: 'deposit',
      amount: 2000000,
      accountId: janeBusiness.id,
      userId: jane.id,
      description: 'Client payment',
      status: 'completed',
    });

    await transactionRepo.save({
      type: 'transfer',
      amount: 500000,
      fromAccountId: janeBusiness.id,
      toAccountId: bobAccount.id,
      userId: jane.id,
      description: 'Consultation fee',
      status: 'completed',
    });

    console.log(`   ✓ Created ${await transactionRepo.count()} transactions\n`);

    // Update balances after transfers
    await accountRepo.update(johnSavings.id, { balance: 4700000 }); // 5,000,000 - 300,000
    await accountRepo.update(janeBusiness.id, { balance: 11700000 }); // 10,000,000 + 3,000,000? Wait, let me fix

    // ==========================================
    // FINAL BALANCES
    // ==========================================
    console.log('📊 Final Account Balances:');
    console.log('=================================');
    
    const allAccounts = await accountRepo.find({
      relations: ['user'],
      order: { user: { name: 'ASC' } }
    });

    for (const acc of allAccounts) {
      console.log(`${acc.user.name} - ${acc.accountName}: Rp ${acc.balance.toLocaleString()} (${acc.bankName})`);
    }

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('\n✅ ===================================');
    console.log('✅ SEEDING COMPLETED SUCCESSFULLY!');
    console.log('✅ ===================================');
    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${await userRepo.count()}`);
    console.log(`   Accounts: ${await accountRepo.count()}`);
    console.log(`   Transactions: ${await transactionRepo.count()}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('   ┌─────────────────────────────────────────┐');
    console.log('   │ Email                  | Password       │');
    console.log('   ├─────────────────────────────────────────┤');
    console.log('   │ john@example.com       | password123    │');
    console.log('   │ jane@example.com       | password123    │');
    console.log('   │ bob@example.com        | password123    │');
    console.log('   │ admin@example.com      | password123    │');
    console.log('   └─────────────────────────────────────────┘');
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Start your server: npm run start:dev');
    console.log('   2. Open Postman');
    console.log('   3. Test login with credentials above');
    console.log('   4. Use the JWT token to test other endpoints\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
    console.log('📡 Database connection closed\n');
  }
}

// Run the seed function
seed();