import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { Chat } from '../chats/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Chat])],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
