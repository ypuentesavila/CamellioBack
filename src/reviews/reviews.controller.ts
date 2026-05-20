import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  findAll(
    @Query('workerId') workerId?: string,
    @Query('jobId') jobId?: string,
    @Query('authorId') authorId?: string,
  ) {
    return this.reviewsService.findAll({ workerId, jobId, authorId });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReviewDto, @Request() req: any) {
    return this.reviewsService.create(dto, req.user.userId);
  }
}
