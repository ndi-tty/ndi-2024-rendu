import React, { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import "./css/flappy-bird.modules.css";
import { API_BASE_URL } from "../config";

const PIPE_GAP = 150; // Increased gap for easier gameplay

interface Bird {
  x: number;
  y: number;
  velocity: number;
  width: number;
  height: number;
}

interface Pipe {
  x: number;
  height: number;
}

interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  gameOver: boolean;
}

interface CaptchaToManyAttempts {
  lastAttempt: string;
  message: string;
}

const FlappyBird: React.FC = () => {
  const [bird, setBird] = useState<Bird>({
    x: 50,
    y: 300,
    velocity: 0,
    width: 10,
    height: 10,
  });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isBot] = useState(false);
  const [isToManyAttempts, setIsToManyAttempts] = useState(false);
  const [nextAvailableAttempt, setNextAvailableAttempt] = useState<Date | null>(
    null
  );
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isWon, setIsWon] = useState(false);
  const [totalFailed, setTotalFailed] = useState(0);

  useEffect(() => {
    //!TODO: Add bot detection into middleware
    const newSocket = io(`${API_BASE_URL}/flappy-bird`);
    setSocket(newSocket);

    newSocket.on("TOTAL_FAILED", (failed: number) => {
      setTotalFailed(failed);
    });

    newSocket.on("TOO_MANY_ATTEMPTS", (failed: CaptchaToManyAttempts) => {
      const lastAttempt = new Date(failed.lastAttempt);
      const nextAttempt = new Date(lastAttempt.getTime() + 15 * 60 * 1000); // 15 minutes later
      setNextAvailableAttempt(nextAttempt);
      setIsToManyAttempts(true);
    });

    newSocket.on("WON_GAME", () => {
      setIsWon(true);
      newSocket.close();
    });

    newSocket.on("INITIAL_STATE", (initialState: GameState) => {
      setBird(initialState.bird);
      setPipes(initialState.pipes);
      setScore(initialState.score);
      setGameOver(initialState.gameOver);
    });

    newSocket.on("UPDATE_STATE", (updatedState: GameState) => {
      console.log("UPDATE_STATE", updatedState);
      setBird(updatedState.bird);
      setPipes(updatedState.pipes);
      setScore(updatedState.score);
      setGameOver(updatedState.gameOver);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    socket?.emit("message", JSON.stringify({ type: "FLAP" }));
  }, [socket]);

  useEffect(() => {
    if (isToManyAttempts && nextAvailableAttempt) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeDiff = nextAvailableAttempt.getTime() - now.getTime();
        if (timeDiff <= 0) {
          setIsToManyAttempts(false);
          setNextAvailableAttempt(null);
          setTimeRemaining("");
        } else {
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeRemaining(`${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isToManyAttempts, nextAvailableAttempt]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && socket) {
        socket.emit("message", JSON.stringify({ type: "FLAP" }));
      }
    },
    [socket]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOver || !socket) return;

      socket.emit("message", JSON.stringify({ type: "UPDATE" }));
    }, 30);

    return () => clearInterval(gameInterval);
  }, [gameOver, socket]);

  if (isBot) {
    return <div>Bot detected! Access denied.</div>;
  }

  if (isToManyAttempts) {
    return (
      <div>
        Too many attempts. Please try again later.
        <div>Next attempt available in: {timeRemaining}</div>
      </div>
    );
  }

  if (isWon) {
    return <div>Congratulations! You won Flappy Bird!</div>;
  }

  return (
    <div className="App">
      <h1>Flappy Bird with React</h1>
      <div className="game-area">
        <div
          className="bird"
          style={{
            top: `${bird.y}px`,
            left: `${bird.x}px`,
            width: `${bird.width}px`,
            height: `${bird.height}px`,
          }}
        ></div>
        {pipes.map((pipe, index) => (
          <div key={index}>
            <div
              className="pipe"
              style={{ height: `${pipe.height}px`, left: `${pipe.x}px` }}
            ></div>
            <div
              className="pipe bottom"
              style={{
                height: `${600 - pipe.height - PIPE_GAP}px`,
                left: `${pipe.x}px`,
                top: `${pipe.height + PIPE_GAP}px`,
              }}
            ></div>
          </div>
        ))}
      </div>
      <div className="score">Score: {score}/2500</div>
      <div className="total-failed">
        Total failed attempts: {totalFailed}/10
      </div>
      {gameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
};

export default FlappyBird;
