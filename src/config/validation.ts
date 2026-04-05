import { plainToClass } from 'class-transformer';
import { IsString, IsOptional, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRATION: string;

  @IsString()
  @IsOptional()
  PORT: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}