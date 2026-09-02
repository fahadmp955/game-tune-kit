import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBody } from '@nestjs/swagger';
import { SegmentsService } from './segments.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { GameAuthGuard } from '../games/guards/game-auth.guard';
import { Segment } from './entities/segment.entity';

@ApiTags('Segments & Cohorts')
@ApiHeader({ name: 'X-Game-Key', description: 'Game API Key for tenant isolation' })
@UseGuards(GameAuthGuard)
@Controller('segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Get()
  @ApiOperation({
    summary: 'List All Defined Cohort Segments',
    description: 'Retrieves all reusable audience segments defined for this game.',
  })
  @ApiResponse({ status: 200, description: 'List of segments', type: [Segment] })
  async findAll(@Req() req: any): Promise<Segment[]> {
    return this.segmentsService.findAll(req.gameId);
  }

  @Get(':id/reach')
  @ApiOperation({
    summary: 'Calculate Live Estimated Audience Reach for a Cohort',
    description: 'Evaluates the rules against real players and returns the count of matching player IDs.',
  })
  @ApiResponse({ status: 200, description: 'Estimated reach statistics' })
  async getReach(@Req() req: any, @Param('id') id: string): Promise<{ segmentId: string; matchingPlayerCount: number }> {
    const playerIds = await this.segmentsService.resolveMatchingPlayerIds(req.gameId, id);
    return { segmentId: id, matchingPlayerCount: playerIds.length };
  }

  @Post()
  @ApiOperation({
    summary: 'Create a New Dynamic Player Cohort',
    description: 'Registers a new compound filter rule set. Reusable across push campaigns and LiveOps events.',
  })
  @ApiBody({
    type: CreateSegmentDto,
    examples: {
      lapsedWhales: {
        summary: 'Lapsed High-Spenders',
        value: {
          name: 'Lapsed Whales ($100+)',
          description: 'Spenders inactive for 7 or more days',
          combinator: 'AND',
          rules: [
            { field: 'attributes.lifetimeSpend', operator: '>=', value: 100 },
            { field: 'attributes.daysInactive', operator: '>=', value: 7 },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Cohort created successfully', type: Segment })
  async create(@Req() req: any, @Body() dto: CreateSegmentDto): Promise<Segment> {
    return this.segmentsService.create(req.gameId, dto);
  }
}
