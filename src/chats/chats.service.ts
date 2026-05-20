import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepo: Repository<Chat>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Job) private jobsRepo: Repository<Job>,
  ) {}

  async findAll(userId: string) {
    const chats = await this.chatsRepo.find({ order: { lastMessageAt: 'DESC' } });
    const userChats = chats.filter((c) => c.participantIds.includes(userId));

    return Promise.all(
      userChats.map(async (chat) => {
        const participants = await this.usersRepo.findBy({ id: In(chat.participantIds) });
        const job = await this.jobsRepo.findOne({ where: { id: chat.jobId } });
        return {
          ...chat,
          job: job ? { id: job.id, title: job.title } : null,
          participants: participants.map(({ passwordHash, ...u }) => u),
        };
      }),
    );
  }

  async findOne(id: string, userId: string) {
    const chat = await this.chatsRepo.findOne({ where: { id } });
    if (!chat) throw new NotFoundException('Chat not found');
    if (!chat.participantIds.includes(userId)) throw new ForbiddenException();

    const participants = await this.usersRepo.findBy({ id: In(chat.participantIds) });
    const job = await this.jobsRepo.findOne({ where: { id: chat.jobId } });

    return {
      ...chat,
      job: job ? { id: job.id, title: job.title } : null,
      participants: participants.map(({ passwordHash, ...u }) => u),
    };
  }

  async create(dto: CreateChatDto) {
    const chat = this.chatsRepo.create({
      ...dto,
      unreadCount: Object.fromEntries(dto.participantIds.map((id) => [id, 0])),
    });
    return this.chatsRepo.save(chat);
  }

  async markRead(chatId: string, userId: string) {
    const chat = await this.chatsRepo.findOne({ where: { id: chatId } });
    if (!chat) throw new NotFoundException('Chat not found');
    await this.chatsRepo.update(chatId, {
      unreadCount: { ...chat.unreadCount, [userId]: 0 },
    });
    return { success: true };
  }
}
