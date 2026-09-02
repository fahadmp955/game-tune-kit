import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Halloween Double XP Weekend', description: 'Internal campaign campaign title' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '🎃 Double XP Weekend is LIVE!', description: 'Push notification alert title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Log in now and earn 2x EXP on all dungeons. Ends Sunday midnight!',
    description: 'Push notification alert body message',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ example: 'default', required: false, description: 'Notification alert sound' })
  @IsString()
  @IsOptional()
  sound?: string;

  @ApiProperty({
    example: { screen: 'dungeon_hub', eventId: 'halloween_2026' },
    required: false,
    description: 'Deep-link custom JSON payload passed to game client upon notification click',
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @ApiProperty({ example: 'all', required: false, description: 'Target cohort segment ID or "all"' })
  @IsString()
  @IsOptional()
  targetSegmentId?: string;

  @ApiProperty({ example: true, default: true, description: 'Respect quiet hours (10 PM - 8 AM local time)' })
  @IsBoolean()
  @IsOptional()
  respectQuietHours?: boolean;

  @ApiProperty({ example: true, default: true, description: 'Trigger immediate dispatch upon creation' })
  @IsBoolean()
  @IsOptional()
  dispatchImmediately?: boolean;
}
