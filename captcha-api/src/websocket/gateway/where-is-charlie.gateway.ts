import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Coordonate,
  InitGamePayload,
  ResultPayload,
  StartGamePayload,
  WhereIsCharlieService,
} from '../services/where-is-charlie.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import {
  CHARLIE_ATTEMPS_COUNTER,
  CHARLIE_FAIL_COUNTER,
  CHARLIE_SUCCESS_COUNTER,
} from 'src/config';
import { Counter } from 'prom-client';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaptchaFingerPrint } from '../guards/entities/fingerprint.entity';
import { UserFingerPrint } from '../services/flappy-bird.service';

export enum Events {
  INIT_GAME = 'init-game',
  START_GAME = 'start-game',
  ERROR = 'error',
  SUBMIT_COORDONATES = 'submit-coordonates',
}

@WebSocketGateway({ cors: true, namespace: 'where-is-charlie' })
export class WhereIsCharlieGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private games: Map<string, WhereIsCharlieService>;

  constructor(
    @InjectPinoLogger(WhereIsCharlieGateway.name)
    private readonly logger: PinoLogger,
    @InjectMetric(CHARLIE_ATTEMPS_COUNTER)
    private attemptsCounter: Counter<string>,
    @InjectMetric(CHARLIE_SUCCESS_COUNTER)
    private successsCounter: Counter<string>,
    @InjectMetric(CHARLIE_FAIL_COUNTER)
    private failsCounter: Counter<string>,
    @InjectRepository(CaptchaFingerPrint)
    private readonly fingerprintRepository: Repository<CaptchaFingerPrint>,
  ) {
    this.games = new Map();
  }

  async createUserFingerPrintIfNotExists(socket: Socket): Promise<void> {
    const userAgent = socket.handshake.headers['user-agent'];
    const ipAddress = socket.handshake.address;

    const fingerprint = await this.fingerprintRepository.findOne({
      where: { userAgent, ipAddress },
    });
    if (!fingerprint) {
      const newFingerprint = new CaptchaFingerPrint();
      newFingerprint.userAgent = userAgent;
      newFingerprint.ipAddress = ipAddress;
      newFingerprint.isFlappyBirdValidated = false;
      await this.fingerprintRepository.save(newFingerprint);
    }
  }

  async setCaptchValidated(socket: Socket): Promise<void> {
    const userAgent = socket.handshake.headers['user-agent'];
    const ipAddress = socket.handshake.address;

    const fingerprint = await this.fingerprintRepository.findOne({
      where: { userAgent, ipAddress },
    });
    if (fingerprint) {
      fingerprint.isCharlieValidated = true;
      await this.fingerprintRepository.save(fingerprint);
    }
  }

  handleConnection() {
    this.logger.info('client connected');
  }

  @SubscribeMessage(Events.INIT_GAME)
  handleInitGame(@ConnectedSocket() client: Socket): InitGamePayload {
    const game = new WhereIsCharlieService();
    this.games.set(client.id, game);
    return game.handleInitGame();
  }

  @SubscribeMessage(Events.START_GAME)
  handleStartGame(@ConnectedSocket() client: Socket): StartGamePayload {
    const game = this.games.get(client.id);
    if (!game) {
      client.emit(Events.ERROR, { message: 'No active game session!' });
      return;
    }
    return game.handleStartGame();
  }

  @SubscribeMessage(Events.SUBMIT_COORDONATES)
  handleCoordonates(
    @MessageBody() data: Coordonate,
    @ConnectedSocket() client: Socket,
  ): ResultPayload {
    // return this.whereIsCharleyService.handleCoordonates(data, client);
    const game = this.games.get(client.id);
    if (!game) {
      client.emit(Events.ERROR, { message: 'No active game session!' });
      return;
    }

    const result = game.handleCoordonates(data, client);
    if (result.success) {
      this.createUserFingerPrintIfNotExists(client);
      this.setCaptchValidated(client);
      this.successsCounter.inc();
    } else {
      this.failsCounter.inc();
    }
    this.attemptsCounter.inc();
    return result;
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.info('client disconnected');
    this.games.delete(client.id);
  }
}
