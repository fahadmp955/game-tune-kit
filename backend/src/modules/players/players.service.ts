import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { UpdatePlayerAttributesDto } from './dto/update-player-attributes.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async findByPlayerId(gameId: string, playerId: string): Promise<Player | null> {
    return this.playerRepository.findOne({ where: { gameId, playerId } });
  }

  async upsertAttributes(gameId: string, dto: UpdatePlayerAttributesDto): Promise<Player> {
    let player = await this.findByPlayerId(gameId, dto.playerId);

    if (!player) {
      player = this.playerRepository.create({
        gameId,
        playerId: dto.playerId,
        country: dto.country,
        timezone: dto.timezone,
        attributes: dto.attributes || {},
      });
    } else {
      if (dto.country) player.country = dto.country;
      if (dto.timezone) player.timezone = dto.timezone;
      player.attributes = {
        ...player.attributes,
        ...dto.attributes,
      };
    }

    return this.playerRepository.save(player);
  }

  async listPlayers(gameId: string, limit = 50): Promise<Player[]> {
    return this.playerRepository.find({
      where: { gameId },
      order: { updatedAt: 'DESC' },
      take: limit,
    });
  }
}
