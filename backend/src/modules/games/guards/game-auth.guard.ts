import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GamesService } from '../games.service';

@Injectable()
export class GameAuthGuard implements CanActivate {
  constructor(private readonly gamesService: GamesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const gameKey = request.headers['x-game-key'] as string;

    if (gameKey) {
      const game = await this.gamesService.findByApiKey(gameKey);
      if (game) {
        request.game = game;
        request.gameId = game.id;
        return true;
      }
      throw new UnauthorizedException('Invalid X-Game-Key provided');
    }

    // Fallback: check query parameter ?gameId= or use first available game in development
    const queryGameId = request.query?.gameId || request.body?.gameId;
    if (queryGameId) {
      try {
        const game = await this.gamesService.findById(queryGameId);
        request.game = game;
        request.gameId = game.id;
        return true;
      } catch (e) {
        throw new UnauthorizedException(`Game with ID "${queryGameId}" not found`);
      }
    }

    // Auto-bootstrap default game if none exists
    const games = await this.gamesService.findAll();
    if (games.length > 0) {
      request.game = games[0];
      request.gameId = games[0].id;
      return true;
    }

    // Create default game if database is empty
    const defaultGame = await this.gamesService.create({
      name: 'Default Game Project',
      bundleId: 'com.gametune.defaultgame',
    });

    request.game = defaultGame;
    request.gameId = defaultGame.id;
    return true;
  }
}
