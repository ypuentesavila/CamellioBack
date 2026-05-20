import { IsEnum } from 'class-validator';

export class PatchStatusDto {
  @IsEnum(['draft', 'open', 'in_progress', 'completed', 'cancelled'])
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
}
