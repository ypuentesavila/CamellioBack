import { IsUUID, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsUUID() jobId: string;
  @IsUUID() offerId: string;
  @IsUUID() targetId: string;
  @IsNumber() @Min(1) @Max(5) rating: number;
  @IsString() comment: string;
}
