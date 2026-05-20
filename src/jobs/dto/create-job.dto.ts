import {
  IsString,
  IsEnum,
  IsObject,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BudgetDto {
  @IsNumber() min: number;
  @IsNumber() max: number;
}

export class CreateJobDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsString() category: string;
  @IsString() location: string;

  @ValidateNested()
  @Type(() => BudgetDto)
  budget: BudgetDto;

  @IsEnum(['flexible', 'this_week', 'urgent'])
  urgency: 'flexible' | 'this_week' | 'urgent';

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsEnum(['draft', 'open'])
  status?: 'draft' | 'open';
}
