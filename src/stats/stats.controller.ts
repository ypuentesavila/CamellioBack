import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('worker/:id')
  workerStats(@Param('id') id: string) {
    return this.statsService.workerStats(id);
  }

  @Get('employer/:id')
  employerStats(@Param('id') id: string) {
    return this.statsService.employerStats(id);
  }
}
