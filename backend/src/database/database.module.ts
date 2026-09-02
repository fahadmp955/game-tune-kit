import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const dbType = configService.get<string>('DATABASE_TYPE', 'sqlite');

        // 1. Supabase / Cloud Managed PostgreSQL via DATABASE_URL
        if (databaseUrl || dbType === 'postgres') {
          return {
            type: 'postgres',
            ...(databaseUrl
              ? { url: databaseUrl }
              : {
                  host: configService.get<string>('DB_HOST', 'localhost'),
                  port: configService.get<number>('DB_PORT', 5432),
                  username: configService.get<string>('DB_USERNAME', 'postgres'),
                  password: configService.get<string>('DB_PASSWORD', 'postgres'),
                  database: configService.get<string>('DB_DATABASE', 'postgres'),
                }),
            ssl: configService.get<string>('DB_SSL', 'true') === 'true'
              ? { rejectUnauthorized: false }
              : false,
            autoLoadEntities: true,
            synchronize: true, // Auto-sync table schema on startup
          };
        }

        // 2. Local SQLite Fallback
        return {
          type: 'better-sqlite3',
          database: configService.get<string>('DATABASE_NAME', 'gametune_pns.sqlite'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
