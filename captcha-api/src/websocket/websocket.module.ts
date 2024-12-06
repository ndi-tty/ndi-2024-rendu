import { Module } from '@nestjs/common';
import { FlappyBirdGateway } from './gateway/flappy-bird.gateway';
import { FlappyBirdService } from './services/flappy-bird.service';
import { WhereIsCharlieGateway } from './gateway/where-is-charlie.gateway';
import { WhereIsCharlieService } from './services/where-is-charlie.service';
import { WsFingerPrintGuard } from './guards/ws-fingerprint.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaptchaFingerPrint } from './guards/entities/fingerprint.entity';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import {
  CHARLIE_SUCCESS_COUNTER,
  CHARLIE_FAIL_COUNTER,
  FLAPPY_BIRD_ATTEMPTS_COUNTER,
  FLAPPY_BIRD_SUCCESSES_COUNTER,
  FLAPPY_BIRD_FAIL_COUNTER,
  CHARLIE_ATTEMPS_COUNTER,
} from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [CaptchaFingerPrint],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([CaptchaFingerPrint]),
  ],
  providers: [
    makeCounterProvider({
      name: CHARLIE_ATTEMPS_COUNTER,
      help: 'Number of "where is charlie" attemps',
    }),
    makeCounterProvider({
      name: CHARLIE_SUCCESS_COUNTER,
      help: 'Number of "where is charlie" successes',
    }),
    makeCounterProvider({
      name: CHARLIE_FAIL_COUNTER,
      help: 'Number of "where is charlie" failures',
    }),
    makeCounterProvider({
      name: FLAPPY_BIRD_ATTEMPTS_COUNTER,
      help: 'number of flappy bird attends made',
    }),
    makeCounterProvider({
      name: FLAPPY_BIRD_SUCCESSES_COUNTER,
      help: 'Number of flappy bird successes',
    }),
    makeCounterProvider({
      name: FLAPPY_BIRD_FAIL_COUNTER,
      help: 'Number of clappy bird fails',
    }),
    FlappyBirdGateway,
    FlappyBirdService,
    WsFingerPrintGuard,
    WhereIsCharlieGateway,
    WhereIsCharlieService,
  ],
})
export class WebsocketModule {}
