import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('workers')
  findWorkers(
    @Query('category') category?: string,
    @Query('q') q?: string,
    @Query('location') location?: string,
  ) {
    return this.usersService.findWorkers({ category, q, location });
  }

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: any,
  ) {
    return this.usersService.update(id, req.user.userId, dto);
  }
}
