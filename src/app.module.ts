import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transactions/transaction.module';
import { AppController } from './app.controller';
import { User } from './user/user.entity';
import { Account } from './account/account.entity';
import { Transaction } from './transactions/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Account, Transaction],
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true', // Auto-create tables (use migrations in production)
        logging: true, // Log SQL queries (disable in production)
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    AccountModule,
    TransactionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { validate } from './config/validation';
// import { AuthModule } from './auth/auth.module';
// import { UserModule } from './user/user.module';
// import { AccountModule } from './account/account.module';
// import { TransactionModule } from './transactions/transaction.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//       validate,
//     }),
//     AuthModule,
//     UserModule,
//     AccountModule,
//     TransactionModule,
//   ],
// })
// export class AppModule {}