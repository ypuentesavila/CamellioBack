import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  findAll(@Query('chatId') chatId: string) {
    return this.messagesService.findByChatId(chatId);
  }

  @Post()
  send(@Body() dto: CreateMessageDto, @Request() req: any) {
    return this.messagesService.send(dto, req.user.userId);
  }
}
