import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('\n🌱 ===================================');
  console.log('🌱 Starting Database Seeding');
  console.log('🌱 ===================================\n');

  try {
    // Check if we already have data
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log('⚠️  Database already has data. Clearing existing data...\n');
      
      // Delete in correct order (due to foreign keys)
      await prisma.transaction.deleteMany();
      console.log('   ✓ Transactions cleared');
      await prisma.account.deleteMany();
      console.log('   ✓ Accounts cleared');
      await prisma.user.deleteMany();
      console.log('   ✓ Users cleared\n');
    }

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 12);

    // ==========================================
    // CREATE USERS
    // ==========================================
    console.log('👥 Creating users...');

    const john = await prisma.user.create({
      data: {
        email: 'john@example.com',
        password: hashedPassword,
        name: 'John Doe',
        role: 'user',
      },
    });

    const jane = await prisma.user.create({
      data: {
        email: 'jane@example.com',
        password: hashedPassword,
        name: 'Jane Smith',
        role: 'user',
      },
    });

    const bob = await prisma.user.create({
      data: {
        email: 'bob@example.com',
        password: hashedPassword,
        name: 'Bob Wilson',
        role: 'user',
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      },
    });

    console.log(`   ✓ Created ${await prisma.user.count()} users`);
    console.log(`     - ${john.name} (${john.email})`);
    console.log(`     - ${jane.name} (${jane.email})`);
    console.log(`     - ${bob.name} (${bob.email})`);
    console.log(`     - ${admin.name} (${admin.email} - ADMIN)\n`);

    // ==========================================
    // CREATE ACCOUNTS
    // ==========================================
    console.log('💰 Creating accounts...');

    // John's accounts
    const johnSavings = await prisma.account.create({
      data: {
        userId: john.id,
        accountNumber: 'ACC1001',
        accountName: 'Savings Account',
        bankName: 'Bank Mandiri',
        balance: 5000000,
        currency: 'IDR',
      },
    });

    const johnChecking = await prisma.account.create({
      data: {
        userId: john.id,
        accountNumber: 'ACC1002',
        accountName: 'Checking Account',
        bankName: 'BCA',
        balance: 2500000,
        currency: 'IDR',
      },
    });

    // Jane's accounts
    const janeBusiness = await prisma.account.create({
      data: {
        userId: jane.id,
        accountNumber: 'ACC2001',
        accountName: 'Business Account',
        bankName: 'Bank BNI',
        balance: 10000000,
        currency: 'IDR',
      },
    });

    const janePersonal = await prisma.account.create({
      data: {
        userId: jane.id,
        accountNumber: 'ACC2002',
        accountName: 'Personal Account',
        bankName: 'Bank Mandiri',
        balance: 3000000,
        currency: 'IDR',
      },
    });

    // Bob's account
    const bobAccount = await prisma.account.create({
      data: {
        userId: bob.id,
        accountNumber: 'ACC3001',
        accountName: 'Main Account',
        bankName: 'Bank BCA',
        balance: 1500000,
        currency: 'IDR',
      },
    });

    console.log(`   ✓ Created ${await prisma.account.count()} accounts\n`);

    // ==========================================
    // CREATE TRANSACTIONS
    // ==========================================
    console.log('💸 Creating transactions...');

    // John's deposits
    await prisma.transaction.create({
      data: {
        type: 'deposit',
        amount: 1000000,
        accountId: johnSavings.id,
        userId: john.id,
        description: 'Salary deposit - January',
        status: 'completed',
      },
    });

    await prisma.transaction.create({
      data: {
        type: 'deposit',
        amount: 500000,
        accountId: johnChecking.id,
        userId: john.id,
        description: 'Bonus deposit',
        status: 'completed',
      },
    });

    // John's withdrawal
    await prisma.transaction.create({
      data: {
        type: 'withdrawal',
        amount: 200000,
        accountId: johnChecking.id,
        userId: john.id,
        description: 'ATM withdrawal',
        status: 'completed',
      },
    });

    // Transfer from John to Jane
    await prisma.transaction.create({
      data: {
        type: 'transfer',
        amount: 300000,
        fromAccountId: johnSavings.id,
        toAccountId: janeBusiness.id,
        userId: john.id,
        description: 'Payment for services',
        status: 'completed',
      },
    });

    // Jane's transactions
    await prisma.transaction.create({
      data: {
        type: 'deposit',
        amount: 2000000,
        accountId: janeBusiness.id,
        userId: jane.id,
        description: 'Client payment',
        status: 'completed',
      },
    });

    await prisma.transaction.create({
      data: {
        type: 'transfer',
        amount: 500000,
        fromAccountId: janeBusiness.id,
        toAccountId: bobAccount.id,
        userId: jane.id,
        description: 'Consultation fee',
        status: 'completed',
      },
    });

    console.log(`   ✓ Created ${await prisma.transaction.count()} transactions\n`);

    // ==========================================
    // UPDATE BALANCES AFTER TRANSFERS
    // ==========================================
    // Update John's savings (lost 300,000 from transfer)
    await prisma.account.update({
      where: { id: johnSavings.id },
      data: { balance: 4700000 },
    });

    // Update Jane's business (gained 300,000 from John, gained 2,000,000 deposit, lost 500,000 transfer)
    // Starting: 10,000,000 + 2,000,000 (deposit) + 300,000 (from John) - 500,000 (to Bob) = 11,800,000
    await prisma.account.update({
      where: { id: janeBusiness.id },
      data: { balance: 11800000 },
    });

    // Update Bob's account (gained 500,000 from Jane)
    await prisma.account.update({
      where: { id: bobAccount.id },
      data: { balance: 2000000 },
    });

    // ==========================================
    // FINAL BALANCES
    // ==========================================
    console.log('📊 Final Account Balances:');
    console.log('=================================');
    
    const allAccounts = await prisma.account.findMany({
      include: {
        user: true,
      },
      orderBy: { user: { name: 'asc' } },
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
    console.log(`   Users: ${await prisma.user.count()}`);
    console.log(`   Accounts: ${await prisma.account.count()}`);
    console.log(`   Transactions: ${await prisma.transaction.count()}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('   ┌─────────────────────────────────────────────────┐');
    console.log('   │ Email                    | Password             │');
    console.log('   ├─────────────────────────────────────────────────┤');
    console.log('   │ john@example.com         | password123          │');
    console.log('   │ jane@example.com         | password123          │');
    console.log('   │ bob@example.com          | password123          │');
    console.log('   │ admin@example.com        | password123          │');
    console.log('   └─────────────────────────────────────────────────┘');
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Start your server: pnpm run start:dev');
    console.log('   2. Test login with credentials above');
    console.log('   3. Use JWT token to access protected endpoints\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('📡 Database connection closed\n');
  }
}

// Run the seed function
main();


