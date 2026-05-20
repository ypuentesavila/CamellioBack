import { IsString, IsOptional, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() @IsString() bio?: string;

  // worker profile fields
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsArray() skills?: string[];
  @IsOptional() @IsNumber() hourlyRate?: number;
  @IsOptional() @IsBoolean() available?: boolean;

  // employer profile fields
  @IsOptional() @IsString() companyName?: string;
}
