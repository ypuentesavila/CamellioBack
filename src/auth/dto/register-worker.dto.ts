import {
  IsEmail,
  IsString,
  MinLength,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class RegisterWorkerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  location: string;

  @IsString()
  category: string;

  @IsArray()
  skills: string[];

  @IsNumber()
  hourlyRate: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
