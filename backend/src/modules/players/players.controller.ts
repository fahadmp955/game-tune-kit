import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBody } from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { UpdatePlayerAttributesDto } from './dto/update-player-attributes.dto';
import { GameAuthGuard } from '../games/guards/game-auth.guard';
import { Player } from './entities/player.entity';

@ApiTags('Players & Attributes')
@ApiHeader({ name: 'X-Game-Key', description: 'Game API Key for tenant isolation' })
@UseGuards(GameAuthGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('attributes')
  @ApiOperation({
    summary: 'Update Dynamic Player In-Game Attributes',
    description: 'Sets or updates game-specific attributes (level, lifetimeSpend, VIP tier) used for cohort segmentation.',
  })
  @ApiBody({
    type: UpdatePlayerAttributesDto,
    examples: {
      updateSpender: {
        summary: 'Update Spender & Level',
        value: {
          playerId: 'usr_10482',
          country: 'US',
          timezone: 'America/New_York',
          attributes: { level: 40, lifetimeSpend: 199.99, vipTier: 4 },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Player attributes updated', type: Player })
  async updateAttributes(@Req() req: any, @Body() dto: UpdatePlayerAttributesDto): Promise<Player> {
    return this.playersService.upsertAttributes(req.gameId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List Players for the Current Game',
    description: 'Lists players and their dynamic attributes.',
  })
  @ApiResponse({ status: 200, description: 'List of players', type: [Player] })
  async listPlayers(@Req() req: any): Promise<Player[]> {
    return this.playersService.listPlayers(req.gameId);
  }
}
