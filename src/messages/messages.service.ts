import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Chat } from '../chats/entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepo: Repository<Message>,
    @InjectRepository(Chat) private chatsRepo: Repository<Chat>,
  ) {}

  async findByChatId(chatId: string) {
    return this.messagesRepo.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
    });
  }

  async send(dto: CreateMessageDto, senderId: string) {
    const chat = await this.chatsRepo.findOne({ where: { id: dto.chatId } });
    if (!chat) throw new NotFoundException('Chat not found');

    const msg = this.messagesRepo.create({
      chatId: dto.chatId,
      senderId,
      content: dto.content,
      type: dto.type ?? 'text',
      readBy: [senderId],
    });
    await this.messagesRepo.save(msg);

    const other = chat.participantIds.find((id) => id !== senderId);
    await this.chatsRepo.update(dto.chatId, {
      lastMessage: dto.content,
      lastMessageAt: new Date(),
      unreadCount: {
        ...chat.unreadCount,
        ...(other ? { [other]: (chat.unreadCount[other] ?? 0) + 1 } : {}),
      },
    });

    return msg;
  }
}
