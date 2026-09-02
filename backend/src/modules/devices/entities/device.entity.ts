import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('devices')
@Index(['gameId', 'deviceToken'], { unique: true })
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  gameId: string;

  @Column()
  @Index()
  playerId: string;

  @Column()
  deviceToken: string;

  @Column({ default: 'android' })
  platform: 'android' | 'ios' | 'web';

  @Column({ nullable: true })
  timezone?: string;

  @Column({ nullable: true })
  appVersion?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastSeenAt: Date;
}
