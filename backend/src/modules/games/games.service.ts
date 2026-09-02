import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game with ID "${id}" not found`);
    }
    return game;
  }

  async findByApiKey(apiKey: string): Promise<Game | null> {
    return this.gameRepository.findOne({ where: { apiKey } });
  }

  async create(dto: CreateGameDto): Promise<Game> {
    const existing = await this.gameRepository.findOne({
      where: [{ name: dto.name }, { bundleId: dto.bundleId }],
    });

    if (existing) {
      throw new ConflictException(`Game with name "${dto.name}" or bundle ID "${dto.bundleId}" already exists`);
    }

    const apiKey = `gtk_live_${uuidv4().replace(/-/g, '').substring(0, 24)}`;

    const game = this.gameRepository.create({
      ...dto,
      apiKey,
    });

    return this.gameRepository.save(game);
  }
}
