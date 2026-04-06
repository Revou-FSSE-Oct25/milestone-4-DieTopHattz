import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class WithdrawDto {
  @IsString()
  accountId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;
}