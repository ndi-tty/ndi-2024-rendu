import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CaptchaFingerPrint } from '../guards/entities/fingerprint.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

const GRAVITY = 0.5;
const FLAP = -5;
const PIPE_WIDTH = 50; // Fixed width for pipes
const PIPE_GAP = 150; // Increased gap for easier gameplay

interface GameState {
  bird: {
    x: number;
    y: number;
    velocity: number;
    width: number;
    height: number;
  };
  pipes: { x: number; height: number }[];
  score: number;
  gameOver: boolean;
}

export interface UserFingerPrint {
  userAgent: string;
  ipAddress: string;
}

let initialState: GameState = {
  bird: { x: 50, y: 300, velocity: 0, width: 15, height: 15 },
  pipes: [],
  score: 0,
  gameOver: false,
};

@Injectable()
export class FlappyBirdService {
  constructor(
    @InjectRepository(CaptchaFingerPrint)
    private readonly fingerprintRepository: Repository<CaptchaFingerPrint>,
  ) {}

  getInitialState(): GameState {
    return initialState;
  }

  flapBird(): void {
    initialState.bird.velocity = FLAP;
  }

  updateGameState(): GameState {
    // Update bird position
    initialState.bird.y += initialState.bird.velocity;
    initialState.bird.velocity += GRAVITY;

    // Add new pipes
    if (
      initialState.pipes.length === 0 ||
      initialState.pipes[initialState.pipes.length - 1].x < 200
    ) {
      const height = Math.random() * (500 - PIPE_GAP - 50) + 50;
      initialState.pipes.push({ x: 400, height });
    }
    initialState.pipes = initialState.pipes.map((pipe) => ({
      ...pipe,
      x: pipe.x - 3,
    }));

    // Collision detection
    initialState.pipes.forEach((pipe) => {
      if (
        initialState.bird.x + initialState.bird.width / 2 > pipe.x &&
        initialState.bird.x - initialState.bird.width / 2 <
          pipe.x + PIPE_WIDTH &&
        (initialState.bird.y - initialState.bird.height / 2 < pipe.height ||
          initialState.bird.y + initialState.bird.height / 2 >
            pipe.height + PIPE_GAP)
      ) {
        initialState.gameOver = true;
      }
    });

    // Check if bird hit the ground or ceiling
    if (
      initialState.bird.y + initialState.bird.height / 2 > 600 ||
      initialState.bird.y - initialState.bird.height / 2 < 0
    ) {
      initialState.gameOver = true;
    }

    // Score update
    initialState.score += 1;

    return initialState;
  }

  resetGameState(): void {
    initialState = {
      bird: { x: 50, y: 300, velocity: 0, width: 15, height: 15 },
      pipes: [],
      score: 0,
      gameOver: false,
    };
  }

  async getUserFingerprint(user: UserFingerPrint): Promise<CaptchaFingerPrint> {
    let fingerprint = await this.fingerprintRepository.findOne({
      where: { userAgent: user.userAgent, ipAddress: user.ipAddress },
    });

    return fingerprint;
  }

  async incrementTotalFailed(
    socket: Socket,
    isGameOver: boolean,
  ): Promise<void> {
    if (!isGameOver) {
      return;
    }
    const userAgent = socket.handshake.headers['user-agent'];
    const ipAddress = socket.handshake.address;

    const fingerprint = await this.fingerprintRepository.findOne({
      where: { userAgent, ipAddress },
    });
    if (fingerprint) {
      fingerprint.totalFailed += 1;
      fingerprint.lastAttempt = new Date();
      fingerprint.isFlappyBirdValidated = false;
      await this.fingerprintRepository.save(fingerprint);
    }
  }

  async setCaptchValidated(socket: Socket): Promise<void> {
    const userAgent = socket.handshake.headers['user-agent'];
    const ipAddress = socket.handshake.address;

    const fingerprint = await this.fingerprintRepository.findOne({
      where: { userAgent, ipAddress },
    });
    if (fingerprint) {
      fingerprint.isFlappyBirdValidated = true;
      await this.fingerprintRepository.save(fingerprint);
    }
  }
}
