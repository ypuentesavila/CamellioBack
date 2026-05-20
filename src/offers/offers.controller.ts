import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CounterOfferDto } from './dto/counter-offer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get()
  findAll(
    @Query('jobId') jobId?: string,
    @Query('workerId') workerId?: string,
    @Query('employerId') employerId?: string,
  ) {
    return this.offersService.findAll({ jobId, workerId, employerId });
  }

  @Post()
  create(@Body() dto: CreateOfferDto, @Request() req: any) {
    return this.offersService.create(dto, req.user.userId);
  }

  @Post(':id/accept')
  accept(@Param('id') id: string, @Request() req: any) {
    return this.offersService.accept(id, req.user.userId);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Request() req: any) {
    return this.offersService.reject(id, req.user.userId);
  }

  @Post(':id/withdraw')
  withdraw(@Param('id') id: string, @Request() req: any) {
    return this.offersService.withdraw(id, req.user.userId);
  }

  @Post(':id/counter')
  counter(
    @Param('id') id: string,
    @Body() dto: CounterOfferDto,
    @Request() req: any,
  ) {
    return this.offersService.counter(id, dto, req.user.userId);
  }
}
