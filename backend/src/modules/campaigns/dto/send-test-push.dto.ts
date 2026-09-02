import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, IsOptional, IsObject } from 'class-validator';

export class SendTestPushDto {
  @ApiProperty({ example: 'fcm_test_device_token_xyz', description: 'Specific recipient device push token' })
  @IsString()
  @IsNotEmpty()
  deviceToken: string;

  @ApiProperty({ example: 'android', enum: ['android', 'ios', 'web'], default: 'android' })
  @IsIn(['android', 'ios', 'web'])
  platform: 'android' | 'ios' | 'web';

  @ApiProperty({ example: '🚀 Test Notification from GameTuneKit', description: 'Test message title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'This is a live test notification dispatched directly to your device.',
    description: 'Test message body',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    example: { test: true, timestamp: 1725280000 },
    required: false,
    description: 'Custom test payload data',
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
