import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsUUID() chatId: string;
  @IsString() content: string;
  @IsOptional() @IsEnum(['text', 'offer_update', 'system']) type?: 'text' | 'offer_update' | 'system';
}
