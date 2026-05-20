import { IsUUID, IsArray, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsUUID() jobId: string;
  @IsArray() participantIds: string[];
  @IsOptional() @IsUUID() offerId?: string;
}
