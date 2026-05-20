import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { PatchStatusDto } from './dto/patch-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('employerId') employerId?: string,
  ) {
    return this.jobsService.findAll({ status, category, employerId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateJobDto, @Request() req: any) {
    return this.jobsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  patchStatus(
    @Param('id') id: string,
    @Body() dto: PatchStatusDto,
    @Request() req: any,
  ) {
    return this.jobsService.patchStatus(id, dto, req.user.userId);
  }
}
