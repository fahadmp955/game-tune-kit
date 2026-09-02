import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export interface SegmentRule {
  field: string; // e.g. "attributes.level", "attributes.lifetimeSpend", "country", "platform"
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'contains';
  value: any;
}

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  gameId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'AND' })
  combinator: 'AND' | 'OR';

  @Column({ type: 'simple-json', default: '[]' })
  rules: SegmentRule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
