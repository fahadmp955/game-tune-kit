import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, LogLevel } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logLevels: Record<string, LogLevel[]> = {
    debug: ['error', 'warn', 'log', 'debug', 'verbose'],
    info: ['error', 'warn', 'log'],
    warn: ['error', 'warn'],
    error: ['error'],
  };

  const configuredLevel = process.env.LOG_LEVEL || 'debug';
  const appLogLevels = logLevels[configuredLevel] || ['error', 'warn', 'log', 'debug'];

  const app = await NestFactory.create(AppModule, {
    logger: appLogLevels,
  });

  const logger = new Logger('Bootstrap');

  // CORS setup
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Interceptors & Filters
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger Documentation (.env gated)
  if (process.env.SWAGGER_ENABLED === 'true') {
    const config = new DocumentBuilder()
      .setTitle('GameTuneKit PNS — Push Notification Service API')
      .setDescription(
        'Production REST API for GameTuneKit Push Notification Service (PNS). Supports device registration, player attributes, cohort segmentation, and campaign dispatch.',
      )
      .setVersion('1.0.0')
      .addApiKey({ type: 'apiKey', name: 'X-Game-Key', in: 'header' }, 'X-Game-Key')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    logger.log('📖 Swagger Documentation available at /api/v1/docs');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 GameTuneKit PNS Backend running at http://localhost:${port}/api/v1`);
  logger.log(`🩺 Health Probe at http://localhost:${port}/api/v1/health`);
  logger.log(`📊 Prometheus Metrics at http://localhost:${port}/api/v1/metrics`);
}

bootstrap();
