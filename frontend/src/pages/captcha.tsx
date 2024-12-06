import React, { useEffect, useRef, useState } from "react";
import { Card, Flex, Heading, Box, Progress, Badge } from "@radix-ui/themes";
import charlieImage from "../assets/charlie.png";
import flappyBirdImage from "../assets/flappy_bird_logo.png";
import FlappyBird from "../components/games/flappy-bird";
import WhereIsCharlie from "../components/games/where-is-charlie";
import { io, Socket } from "socket.io-client";
import "./css/captcha.modules.css";
import { API_BASE_URL } from "../config";

enum Games {
  FLAPPY_BIRD = "flappy-bird",
  WHERE_IS_CHARLIE = "where-is-charlie",
}

const CaptchaPage: React.FC = () => {
  const ws = useRef<Socket | null>(null);
  const [selectedCaptcha, setSelectedCaptcha] = React.useState<Games | null>(
    null
  );
  const [isFlappyBirdValidated, setIsFlappyBirdValidated] = useState(false);
  const [isCharlieValidated, setIsCharlieValidated] = useState(false);

  useEffect(() => {
    // !TODO: Add same logic to flappy-bird.tsx
    const newSocket = io(`${API_BASE_URL}/finger-print`);
    ws.current = newSocket;
    ws.current.on("FLAPPY_BIRD_VALIDATED", (message: any) => {
      setIsFlappyBirdValidated(message.message);
    });
    ws.current.on("CHARLIE_VALIDATED", (message: any) => {
      setIsCharlieValidated(message.message);
    });
    // setSelectedCaptcha("");
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleEmitGameWon = (game: Games, bool: boolean) => {
    if (game === Games.FLAPPY_BIRD) {
      setIsFlappyBirdValidated(bool);
    } else {
      setIsCharlieValidated(bool);
    }
    setSelectedCaptcha(null);
  };

  return (
    <>
      {!selectedCaptcha && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--accent-1)",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Heading style={{ marginBottom: "var(--space-4)" }}>
            Selectioner votre CAPTCHA
          </Heading>
          <p style={{ marginTop: "var(--space-2)" }}>
            VOUS DEVEZ RÉSOUDRE LES DEUX <strong>CAPTCHAS</strong> POUR ACCÉDER
            À LA RESSOURCE DEMANDÉE
          </p>
          <Card
            style={{
              padding: "10px",
              borderRadius: "var(--radius-4)",
              boxShadow: "var(--shadow-5)",
              backgroundColor: "white",
              maxWidth: "600px",
              textAlign: "center",
              marginBottom: "var(--space-4)",
            }}
          >
            <Flex justify="center" gap="var(--space-4)">
              <Box
                onClick={() => {
                  if (!isFlappyBirdValidated)
                    setSelectedCaptcha(Games.FLAPPY_BIRD);
                }}
                style={{
                  cursor: isFlappyBirdValidated ? "not-allowed" : "pointer",
                  width: "15em",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className={isFlappyBirdValidated ? "" : "scale"}
              >
                <img
                  src={flappyBirdImage}
                  alt="Flappy Bird"
                  style={{
                    height: "8em",
                  }}
                />
                {isFlappyBirdValidated && (
                  <Badge color="green" size="3" style={{ padding: "5px 25px" }}>
                    Validé
                  </Badge>
                )}
              </Box>
              <Box
                onClick={() => {
                  if (!isCharlieValidated)
                    setSelectedCaptcha(Games.WHERE_IS_CHARLIE);
                }}
                style={{
                  cursor: isCharlieValidated ? "not-allowed" : "pointer",
                  width: "15em",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className={isCharlieValidated ? "" : "scale"}
              >
                <img
                  src={charlieImage}
                  alt="Où est Charlie ?"
                  style={{
                    height: "8em",
                  }}
                />
                {isCharlieValidated && (
                  <Badge color="green" size="3" style={{ padding: "5px 25px" }}>
                    Validé
                  </Badge>
                )}
              </Box>
            </Flex>
          </Card>
          <Box maxWidth="300px" style={{ width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: 25 }}>
              {+isCharlieValidated + +isFlappyBirdValidated} / 2{" "}
            </p>
            <Progress
              value={(+isCharlieValidated + +isFlappyBirdValidated / 2) * 100}
            />
          </Box>
        </Box>
      )}
      {selectedCaptcha === Games.FLAPPY_BIRD && (
        <FlappyBird
          emitGameWon={(bool) => handleEmitGameWon(Games.FLAPPY_BIRD, bool)}
        />
      )}
      {selectedCaptcha === Games.WHERE_IS_CHARLIE && (
        <WhereIsCharlie
          emitGameWon={(bool) =>
            handleEmitGameWon(Games.WHERE_IS_CHARLIE, bool)
          }
        />
      )}
    </>
  );
};

export default CaptchaPage;
