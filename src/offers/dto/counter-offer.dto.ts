import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CounterOfferDto {
  @IsNumber() price: number;
  @IsOptional() @IsString() note?: string;
}
