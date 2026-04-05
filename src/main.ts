import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Debug: Check if JWT_SECRET is loaded
  const jwtSecret = configService.get('JWT_SECRET');
  console.log('JWT_SECRET loaded:', jwtSecret ? 'Yes' : 'No');
  if (!jwtSecret) {
    console.error('ERROR: JWT_SECRET is not defined in environment variables');
    console.error('Please create a .env file with JWT_SECRET=your-secret-key');
    process.exit(1);
  }
  
  const port = configService.get('PORT') || 3000;
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();