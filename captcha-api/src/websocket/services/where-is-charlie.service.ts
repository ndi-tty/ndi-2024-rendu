import { join } from 'path';
import { readFileSync } from 'fs';
import { Socket } from 'socket.io';
import { parse } from 'csv-parse/sync';
import { Events } from '../gateway/where-is-charlie.gateway';

enum GameState {
  NOT_STARTED = 'not-started',
  WON = 'won',
  IN_PROGRESS = 'in-progress',
  LOST = 'lost',
}

export interface InitGamePayload {
  attemptsLeft: number;
  imageBase64: string;
  gameState: GameState;
}

export interface StartGamePayload {
  message: string;
  gameState: GameState;
}

export interface ResultPayload {
  attemptsLeft: number;
  message: string;
  success: boolean;
  gameState: GameState;
}

export interface Coordonate {
  x: number;
  y: number;
}

interface Annotation {
  filename: string;
  width: string;
  height: string;
  class: string;
  xmin: string;
  ymin: string;
  xmax: string;
  ymax: string;
}

export class WhereIsCharlieService {
  private annotation: Annotation;
  private attemptsLeft: number;
  private gameState: GameState;

  handleInitGame(): InitGamePayload {
    this.gameState = GameState.NOT_STARTED;
    this.attemptsLeft = 3;

    const csvPath = join(
      process.cwd(),
      'datasets/where-is-charlie/annotations.csv',
    );
    const csvData = readFileSync(csvPath, 'utf8');
    const records: Annotation[] = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });
    const randomIndex = Math.floor(Math.random() * records.length);
    this.annotation = records[randomIndex];

    const imagePath = join(
      process.cwd(),
      'datasets/where-is-charlie',
      this.annotation.filename,
    );
    const imageBase64 = readFileSync(imagePath).toString('base64');

    const payload: InitGamePayload = {
      attemptsLeft: this.attemptsLeft,
      imageBase64,
      gameState: this.gameState,
    };

    return payload;
  }

  handleStartGame(): StartGamePayload {
    this.gameState = GameState.IN_PROGRESS;
    return { message: 'Game started!', gameState: this.gameState };
  }

  handleCoordonates(data: Coordonate, client: Socket) {
    if (!this.annotation || this.gameState !== GameState.IN_PROGRESS) {
      client.emit(Events.ERROR, { message: 'No active game session!' });
      return;
    }

    const { x, y } = data;

    // Normalize the bounding box from the annotation
    const { xmin, ymin, xmax, ymax, width, height } = this.annotation;

    const normalizedBox = {
      xmin: parseFloat(xmin) / parseFloat(width),
      ymin: parseFloat(ymin) / parseFloat(height),
      xmax: parseFloat(xmax) / parseFloat(width),
      ymax: parseFloat(ymax) / parseFloat(height),
    };

    // Check if the clicked coordinates are within the bounding box
    if (
      x >= normalizedBox.xmin &&
      x <= normalizedBox.xmax &&
      y >= normalizedBox.ymin &&
      y <= normalizedBox.ymax
    ) {
      this.gameState = GameState.WON;
      const result: ResultPayload = {
        attemptsLeft: this.attemptsLeft,
        message: 'You found Charlie!',
        success: true,
        gameState: this.gameState,
      };
      return result;
    } else {
      this.attemptsLeft--;
      if (this.attemptsLeft < 1) {
        this.gameState = GameState.LOST;
      }
      const result: ResultPayload = {
        attemptsLeft: this.attemptsLeft,
        message: 'Try again!',
        success: false,
        gameState: this.gameState,
      };
      return result;
    }
  }
}
