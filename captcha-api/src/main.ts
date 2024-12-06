import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Logger } from 'nestjs-pino';
import { otelSDK } from './tracing';

async function bootstrap() {
  await otelSDK.start();
  const app = await NestFactory.create(MainModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  };

  app.enableCors(corsOptions);
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(8080);
}
bootstrap();
