import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatId: string;

  @Column()
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ['text', 'offer_update', 'system'],
    default: 'text',
  })
  type: 'text' | 'offer_update' | 'system';

  @Column({ type: 'simple-array', default: '' })
  readBy: string[];

  @CreateDateColumn()
  createdAt: Date;
}
