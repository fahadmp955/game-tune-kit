import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, IsOptional, IsObject } from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({ example: 'usr_10482', description: 'Studio unique player identifier' })
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({ example: 'fcm_token_sample_84920482', description: 'APNs or FCM push registration token' })
  @IsString()
  @IsNotEmpty()
  deviceToken: string;

  @ApiProperty({ example: 'android', enum: ['android', 'ios', 'web'], description: 'Client operating platform' })
  @IsIn(['android', 'ios', 'web'])
  platform: 'android' | 'ios' | 'web';

  @ApiProperty({ example: 'America/New_York', required: false, description: 'IANA timezone identifier' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ example: '1.2.0', required: false, description: 'Client application version' })
  @IsString()
  @IsOptional()
  appVersion?: string;

  @ApiProperty({
    example: { level: 32, lifetimeSpend: 49.99, isSpender: true },
    required: false,
    description: 'Dynamic player attributes to sync simultaneously',
  })
  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>;
}
