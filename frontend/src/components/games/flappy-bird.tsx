import { useState, useEffect, useCallback, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import "../../pages/css/flappy-bird.modules.css";
import gameOverLogo from "../../assets/game_over_2.png";
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  Spinner,
  Card,
} from "@radix-ui/themes";

import flappyBirdLogo from "../../assets/flappy_bird_logo.png";
import { API_BASE_URL } from "../../config";

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

interface FlappyBirdProps {
  emitGameWon: (data: boolean) => void;
}

// !TODO: Supprimer localStorage lors de la navigation
const FlappyBird: React.FC<FlappyBirdProps> = ({ emitGameWon }) => {
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
  const [totalFailed, setTotalFailed] = useState(0);
  const [gameStarted, setGameStarted] = useState(
    localStorage.getItem("gameFlappyStarted") === "true"
  );

  useEffect(() => {
    console.log("[flappy-bird.tsx] : RUNNING EMIT WEBSOCKET ", gameStarted);
    socket?.emit("message", JSON.stringify({ type: "FLAP" }));
  }, [socket]);

  useEffect(() => {
    if (gameStarted) {
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
        emitGameWon(true);
      });

      newSocket.on("INITIAL_STATE", (initialState: GameState) => {
        setBird(initialState.bird);
        setPipes(initialState.pipes);
        setScore(initialState.score);
        setGameOver(initialState.gameOver);
      });

      newSocket.on("UPDATE_STATE", (updatedState: GameState) => {
        setBird(updatedState.bird);
        setPipes(updatedState.pipes);
        setScore(updatedState.score);
        setGameOver(updatedState.gameOver);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [gameStarted]);

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
    if (gameStarted) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [handleKeyPress, gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      const gameInterval = setInterval(() => {
        if (gameOver || !socket) {
          return;
        }

        socket.emit("message", JSON.stringify({ type: "UPDATE" }));
      }, 30);

      return () => clearInterval(gameInterval);
    }
  }, [gameOver, socket, gameStarted]);

  const getTotalFailedColor = useMemo(() => {
    if (totalFailed >= 8) return "red";
    if (totalFailed >= 5) return "orange";
    return "green";
  }, [totalFailed]);

  const getScoreColor = useMemo(() => {
    if (score >= 700) return "green";
    if (score >= 300) return "orange";
    return "red";
  }, [score]);

  const handleNewGame = () => {
    window.location.reload();
    localStorage.setItem("gameFlappyStarted", "true");
  };

  const handleStartGame = () => {
    setGameStarted(true);
    localStorage.setItem("gameFlappyStarted", "true");
  };

  const scoreBoardStyles = {
    position: "relative",
    width: "600px",
    padding: "var(--space-4)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    boxShadow: "var(--shadow-3)",
    zIndex: 10,
    fontWeight: 500,
    color: "#333",
    fontSize: "16px",
    alignItems: "center",
    margin: "0 auto",
  };

  const buttonHandleNewGamStyles = {
    position: "absolute",
    top: "70%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    padding: "12px 24px",
    backgroundColor: "var(--accent-1)",
    borderRadius: "var(--radius-full)",
    boxShadow: "var(--shadow-4)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    cursor: "pointer",
  };

  if (isBot) {
    return <div>Bot detected! Access denied.</div>;
  }

  if (isToManyAttempts) {
    return (
      <Box
        className="game-area"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Flex
          direction="column"
          gap="var(--space-4)"
          align="center"
          content="center"
          justify="center"
          style={{
            padding: "var(--space-5)",
            borderRadius: "var(--radius-4)",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            boxShadow: "var(--shadow-5)",
            maxWidth: "400px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <img
            src={flappyBirdLogo}
            alt="Flappy Bird"
            style={{
              width: "80%",
              borderRadius: "var(--radius-3)",
              marginBottom: "var(--space-4)",
            }}
          />
          <Heading size="4" as="h2">
            Trop de tentatives
          </Heading>
          <Text size="3" color="gray">
            Essayer plus tard
          </Text>
          <Text size="4">Prochaine tentatives disponibles</Text>
          <Card>
            <Flex gap="3" align="center">
              <Spinner />
              <Text size="4">
                <strong>{timeRemaining}</strong>
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Box>
    );
  }

  return (
    <div className="App">
      {gameStarted && (
        <div className="game-area" style={{ position: "relative" }}>
          <div
            className="bird"
            style={{
              top: `${bird.y}px`,
              left: `${bird.x}px`,
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
          {gameOver && (
            <>
              <img
                src={gameOverLogo}
                alt="Game Over"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              />
              <Button
                onClick={handleNewGame}
                variant="soft"
                size="3"
                style={buttonHandleNewGamStyles as React.CSSProperties}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "var(--shadow-5)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "var(--shadow-4)")
                }
              >
                Restart New CAPTCHA
              </Button>
            </>
          )}
        </div>
      )}

      {!gameStarted && (
        <div className="game-area" style={{ position: "relative" }}>
          <img
            src={flappyBirdLogo}
            alt="Flappy Bird"
            style={{ width: "100%" }}
          />
          <Button
            onClick={handleStartGame}
            variant="soft"
            size="3"
            style={buttonHandleNewGamStyles as React.CSSProperties}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "var(--shadow-5)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "var(--shadow-4)")
            }
          >
            {" "}
            Start CAPTCHA
          </Button>
        </div>
      )}
      <Flex
        style={scoreBoardStyles as React.CSSProperties}
        direction="row"
        justify={"between"}
      >
        <Box>
          <strong>Failed:</strong>{" "}
          <span style={{ color: getTotalFailedColor }}>{totalFailed}/10</span>
        </Box>
        <Box>
          <strong>Score:</strong>{" "}
          <span style={{ color: getScoreColor }}>{score}/1250</span>
        </Box>
        {/* <Box>
          <span>"Space" to flap</span>
        </Box> */}
      </Flex>
    </div>
  );
};

export default FlappyBird;
