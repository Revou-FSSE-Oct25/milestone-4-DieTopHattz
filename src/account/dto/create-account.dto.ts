import { IsString, IsOptional, IsNumber, Min, IsIn } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  accountName: string;

  @IsString()
  bankName: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number;

  @IsOptional()
  @IsString()
  @IsIn(['IDR', 'USD', 'EUR'])
  currency?: string;
}