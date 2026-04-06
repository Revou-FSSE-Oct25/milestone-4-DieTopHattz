import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class DepositDto {
  @IsString()
  accountId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;
}