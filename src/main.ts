import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  
  // Security headers
  app.use(helmet());
  
  // Enable CORS
  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  console.log(`📊 Environment: ${configService.get('NODE_ENV') || 'development'}`);
}
bootstrap();