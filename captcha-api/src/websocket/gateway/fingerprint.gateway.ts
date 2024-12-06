import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FlappyBirdService } from '../services/flappy-bird.service';

@WebSocketGateway({ cors: true, namespace: 'finger-print' })
export class FingerPrintGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly flappyBirdService: FlappyBirdService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const userFingerprint = {
      userAgent: client.handshake.headers['user-agent'],
      ipAddress: client.handshake.address,
    };

    const user =
      await this.flappyBirdService.createUserFingerprintIfNotExists(
        userFingerprint,
      );

    client.emit('FLAPPY_BIRD_VALIDATED', {
      message: user.isFlappyBirdValidated,
    });
    client.emit('CHARLIE_VALIDATED', {
      message: user.isCharlieValidated,
    });
  }

  handleDisconnect(client: Socket) {
    console.log('[FingerPrint]: Client Disconnected');
  }
}
