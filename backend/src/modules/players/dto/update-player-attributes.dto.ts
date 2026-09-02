import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class UpdatePlayerAttributesDto {
  @ApiProperty({ example: 'usr_10482', description: 'Studio unique player identifier' })
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({ example: 'US', required: false, description: 'ISO 2-letter country code' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'America/New_York', required: false, description: 'IANA timezone identifier' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({
    example: { level: 35, lifetimeSpend: 79.99, vipTier: 4, daysInactive: 0 },
    description: 'Dynamic in-game attributes map',
  })
  @IsObject()
  attributes: Record<string, any>;
}
