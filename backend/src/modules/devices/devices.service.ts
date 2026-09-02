import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { PlayersService } from '../players/players.service';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly playersService: PlayersService,
  ) {}

  async registerDevice(gameId: string, dto: RegisterDeviceDto): Promise<Device> {
    // 1. Sync player attributes if provided
    if (dto.attributes && Object.keys(dto.attributes).length > 0) {
      await this.playersService.upsertAttributes(gameId, {
        playerId: dto.playerId,
        timezone: dto.timezone,
        attributes: dto.attributes,
      });
    }

    // 2. Upsert device token
    let device = await this.deviceRepository.findOne({
      where: { gameId, deviceToken: dto.deviceToken },
    });

    if (!device) {
      device = this.deviceRepository.create({
        gameId,
        playerId: dto.playerId,
        deviceToken: dto.deviceToken,
        platform: dto.platform,
        timezone: dto.timezone,
        appVersion: dto.appVersion,
        isActive: true,
      });
    } else {
      device.playerId = dto.playerId;
      device.platform = dto.platform;
      if (dto.timezone) device.timezone = dto.timezone;
      if (dto.appVersion) device.appVersion = dto.appVersion;
      device.isActive = true;
      device.lastSeenAt = new Date();
    }

    return this.deviceRepository.save(device);
  }

  async markTokenInactive(gameId: string, deviceToken: string): Promise<void> {
    await this.deviceRepository.update({ gameId, deviceToken }, { isActive: false });
  }

  async findActiveDevices(gameId: string, playerIds?: string[]): Promise<Device[]> {
    const qb = this.deviceRepository.createQueryBuilder('device')
      .where('device.gameId = :gameId', { gameId })
      .andWhere('device.isActive = :isActive', { isActive: true });

    if (playerIds && playerIds.length > 0) {
      qb.andWhere('device.playerId IN (:...playerIds)', { playerIds });
    }

    return qb.getMany();
  }

  async countDevices(gameId: string): Promise<{ total: number; active: number }> {
    const total = await this.deviceRepository.count({ where: { gameId } });
    const active = await this.deviceRepository.count({ where: { gameId, isActive: true } });
    return { total, active };
  }
}
