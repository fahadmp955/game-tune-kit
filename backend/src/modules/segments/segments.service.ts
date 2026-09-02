import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment, SegmentRule } from './entities/segment.entity';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class SegmentsService {
  constructor(
    @InjectRepository(Segment)
    private readonly segmentRepository: Repository<Segment>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async findAll(gameId: string): Promise<Segment[]> {
    return this.segmentRepository.find({
      where: { gameId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(gameId: string, id: string): Promise<Segment> {
    const segment = await this.segmentRepository.findOne({ where: { gameId, id } });
    if (!segment) {
      throw new NotFoundException(`Cohort Segment with ID "${id}" not found`);
    }
    return segment;
  }

  async create(gameId: string, dto: CreateSegmentDto): Promise<Segment> {
    const segment = this.segmentRepository.create({
      gameId,
      name: dto.name,
      description: dto.description,
      combinator: dto.combinator || 'AND',
      rules: dto.rules || [],
      cachedReach: dto.cachedReach || 0,
    });

    return this.segmentRepository.save(segment);
  }

  /**
   * Evaluates rules against player entities in memory / query
   */
  async resolveMatchingPlayerIds(gameId: string, segmentId?: string): Promise<string[]> {
    if (!segmentId || segmentId === 'all') {
      const allPlayers = await this.playerRepository.find({
        where: { gameId },
        select: ['playerId'],
      });
      return allPlayers.map((p) => p.playerId);
    }

    const segment = await this.findById(gameId, segmentId);
    const players = await this.playerRepository.find({ where: { gameId } });

    const matchingPlayers = players.filter((player) => {
      if (!segment.rules || segment.rules.length === 0) return true;

      const evalRule = (rule: SegmentRule): boolean => {
        let actualValue: any;
        if (rule.field.startsWith('attributes.')) {
          const attrKey = rule.field.replace('attributes.', '');
          actualValue = player.attributes?.[attrKey];
        } else if (rule.field === 'country') {
          actualValue = player.country;
        } else if (rule.field === 'timezone') {
          actualValue = player.timezone;
        }

        if (actualValue === undefined || actualValue === null) return false;

        switch (rule.operator) {
          case '==':
            return actualValue === rule.value;
          case '!=':
            return actualValue !== rule.value;
          case '>':
            return Number(actualValue) > Number(rule.value);
          case '>=':
            return Number(actualValue) >= Number(rule.value);
          case '<':
            return Number(actualValue) < Number(rule.value);
          case '<=':
            return Number(actualValue) <= Number(rule.value);
          case 'in':
            return Array.isArray(rule.value) ? rule.value.includes(actualValue) : false;
          case 'contains':
            return String(actualValue).toLowerCase().includes(String(rule.value).toLowerCase());
          default:
            return false;
        }
      };

      if (segment.combinator === 'OR') {
        return segment.rules.some(evalRule);
      }
      return segment.rules.every(evalRule);
    });

    return matchingPlayers.map((p) => p.playerId);
  }
}
