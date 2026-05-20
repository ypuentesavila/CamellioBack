import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobId: string;

  @Column({ nullable: true })
  offerId: string;

  @Column({ type: 'simple-array' })
  participantIds: string[];

  @Column({ nullable: true, type: 'text' })
  lastMessage: string;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @Column({ type: 'json', default: {} })
  unreadCount: Record<string, number>;

  @CreateDateColumn()
  createdAt: Date;
}
