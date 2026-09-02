import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('players')
@Index(['gameId', 'playerId'], { unique: true })
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  gameId: string;

  @Column()
  playerId: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  timezone?: string;

  @Column({ type: 'simple-json', default: '{}' })
  attributes: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
