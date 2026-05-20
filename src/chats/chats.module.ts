import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Job])],
  providers: [ChatsService],
  controllers: [ChatsController],
  exports: [TypeOrmModule],
})
export class ChatsModule {}
