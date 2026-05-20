import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get()
  getFeed(@Query('userId') userId: string, @Request() req: any) {
    return this.activityService.getFeed(userId ?? req.user.userId);
  }
}
