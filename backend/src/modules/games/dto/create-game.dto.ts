import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ example: 'Cyber Clash 2088', description: 'Display name of the game' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'com.studio.cyberclash', description: 'Application bundle identifier' })
  @IsString()
  @IsNotEmpty()
  bundleId: string;

  @ApiProperty({ required: false, description: 'Google FCM service account JSON credentials' })
  @IsString()
  @IsOptional()
  fcmServiceAccountJson?: string;

  @ApiProperty({ required: false, description: 'Apple APNs .p8 private key' })
  @IsString()
  @IsOptional()
  apnsKeyP8?: string;

  @ApiProperty({ required: false, example: 'ABCD1234EF', description: 'Apple APNs Key ID' })
  @IsString()
  @IsOptional()
  apnsKeyId?: string;

  @ApiProperty({ required: false, example: 'TEAMID987', description: 'Apple Developer Team ID' })
  @IsString()
  @IsOptional()
  apnsTeamId?: string;
}
