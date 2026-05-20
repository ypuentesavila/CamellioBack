import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateOfferDto {
  @IsUUID() jobId: string;
  @IsUUID() employerId: string;
  @IsNumber() proposedPrice: number;
  @IsString() estimatedDuration: string;
  @IsString() message: string;
}
