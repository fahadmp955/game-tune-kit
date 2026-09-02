import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  bundleId: string;

  @Column({ unique: true })
  apiKey: string;

  @Column({ nullable: true })
  fcmServiceAccountJson?: string;

  @Column({ nullable: true })
  apnsKeyP8?: string;

  @Column({ nullable: true })
  apnsKeyId?: string;

  @Column({ nullable: true })
  apnsTeamId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
