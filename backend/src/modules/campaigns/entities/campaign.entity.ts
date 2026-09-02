import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  gameId: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ nullable: true })
  sound?: string;

  @Column({ type: 'simple-json', default: '{}' })
  data: Record<string, any>;

  @Column({ nullable: true })
  targetSegmentId?: string;

  @Column({ default: 'draft' })
  status: 'draft' | 'scheduled' | 'sent';

  @Column({ nullable: true })
  scheduledFor?: Date;

  @Column({ default: 0 })
  sentCount: number;

  @Column({ default: 0 })
  successCount: number;

  @Column({ default: 0 })
  failedCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
