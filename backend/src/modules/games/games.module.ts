import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GameAuthGuard } from './guards/game-auth.guard';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GamesController],
  providers: [GamesService, GameAuthGuard],
  exports: [GamesService, GameAuthGuard],
})
export class GamesModule {}
