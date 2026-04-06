// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Explicitly load .env from project root
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug: Check if DATABASE_URL is loaded
console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create users
  const john = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'user',
    },
  });

  const jane = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'user',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  console.log('✅ Users created');
  console.log('\n🔐 Test Credentials:');
  console.log('  john@example.com / password123');
  console.log('  jane@example.com / password123');
  console.log('  admin@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });