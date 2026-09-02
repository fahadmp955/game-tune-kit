import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';

@ApiTags('Games & Multi-Tenancy')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @ApiOperation({
    summary: 'List All Registered Studio Games',
    description: 'Returns all games configured in the studio portfolio.',
  })
  @ApiResponse({ status: 200, description: 'List of games', type: [Game] })
  async findAll(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Game Details by ID',
    description: 'Retrieves a single game by its unique identifier.',
  })
  @ApiResponse({ status: 200, description: 'Game details', type: Game })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async findOne(@Param('id') id: string): Promise<Game> {
    return this.gamesService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Register a New Game into Studio Portfolio',
    description: 'Creates a new isolated game container with a unique X-Game-Key and credentials vault.',
  })
  @ApiBody({
    type: CreateGameDto,
    examples: {
      standardGame: {
        summary: 'Cyber Clash Game',
        value: {
          name: 'Cyber Clash 2088',
          bundleId: 'com.studio.cyberclash',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Game successfully created', type: Game })
  @ApiResponse({ status: 409, description: 'Game already exists' })
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gamesService.create(createGameDto);
  }
}
