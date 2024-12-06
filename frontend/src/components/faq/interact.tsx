import React, { useEffect, useRef, useState } from "react";
import { Box, Flex } from "@radix-ui/themes";
import { Popup } from "./game-popup";
import { PromptPopup } from "./prompt-popup";
import { ChoicePopup, ChoicePopupProps } from "./choice-popup"; // Import the choice popup component
import { Detail } from "../../pages/faq";

interface InteractProps {
  sprite: string;
  coords: { x: number; y: number };
  popupText?: string;
  popupImage?: string; // Optional image source for the popup
  isUsingPrompt?: boolean;
  isChoicePopup?: boolean; // New prop
  desactivateOnclick?: boolean; // New prop
  choices?: ChoicePopupProps; // List of choices
  size: string;
  title: string;
  details: Detail[];
  onNext?: () => void;
}

export const Interact: React.FC<InteractProps> = ({
  sprite,
  coords,
  popupText,
  popupImage,
  isUsingPrompt,
  isChoicePopup,
  desactivateOnclick,
  choices = {}, // Default to empty object
  onNext,
  size,
  title,
  details,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [_, setChoiceResult] = useState<"success" | "failure" | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleImageClick = () => {
    setIsPopupOpen(true);
  };

  const handleChoiceMade = (isCorrect: boolean) => {
    setChoiceResult(isCorrect ? "success" : "failure");
  };

  const handleNext = () => {
    setChoiceResult(null); // Reset the choice result
    setIsPopupOpen(false); // Close the popup
    if (onNext) onNext(); // Notify parent if required
    setTimeout(() => setIsPopupOpen(true), 0); // Reopen the popup immediately
  };

  return (
    <Box
      ref={containerRef}
      style={{ position: "relative", width: "80vw", height: "auto" }}
    >
      <Flex
        style={{
          flexDirection: "column",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(${coords.x}%, ${coords.y}%)`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h3 style={{ color: "white" }}>{title}</h3>
        <img
          className="interact"
          src={sprite}
          alt="Sprite"
          style={{
            width: `${size}vw`,
            maxWidth: "200px",
            height: "auto",
            objectFit: "contain",
          }}
          onClick={desactivateOnclick ? () => {} : handleImageClick}
          onError={(e) => {
            console.error("Error loading image:", e.target);
          }}
        />
      </Flex>
      {isPopupOpen && isChoicePopup && (
        <ChoicePopup
          {...choices} // Pass the current choice
          onChoiceMade={handleChoiceMade} // Handle the response
          onNext={handleNext} // Handle the next button click
        />
      )}
      {isPopupOpen && !isChoicePopup && (
        <>
          {isUsingPrompt ? (
            <PromptPopup text={popupText} imageSrc={popupImage} />
          ) : (
            <Popup text={popupText} imageSrc={popupImage} details={details} />
          )}
        </>
      )}
    </Box>
  );
};
