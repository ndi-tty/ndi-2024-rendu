import React, { useState } from "react";
import { Box } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export interface ChoicePopupProps {
  question?: string; // The main question text
  image?: string; // Optional image source
  option1?: string; // Text for the first button
  option2?: string; // Text for the second button
  successText?: string; // Text to display on success
  failureText?: string; // Text to display on failure
  correctOption?: 1 | 2; // The correct option number (1 or 2)
  is_next?: number; // New prop to define the next scene
  onChoiceMade?: (isCorrect: boolean) => void; // Callback to notify parent of the result
  onNext?: () => void; // Callback for when the "Next" button is clicked
}

export const ChoicePopup: React.FC<ChoicePopupProps> = ({
  question,
  option1,
  option2,
  successText,
  failureText,
  image,
  correctOption,
  is_next, // Use the is_next prop
  onChoiceMade, // Callback for the result
  onNext, // Callback for the Next button
}) => {
  const [response, setResponse] = useState<"success" | "failure" | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleResponse = (chosenOption: 1 | 2) => {
    const isCorrect = chosenOption === correctOption;
    setResponse(isCorrect ? "success" : "failure");
    if (onChoiceMade) {
      onChoiceMade(isCorrect); // Notify parent of the result
    }
  };

  const onRetry = () => {
    setResponse(null);
    if (onRetry) {
      onRetry(); // Notify parent of the retry
    }
  };

  const handleNext = () => {
    if (is_next !== undefined) {
      // If is_next is provided, navigate to the next scene
      navigate(`/scene-${is_next}`);
    } else if (onNext) {
      // Otherwise, trigger onNext if available
      onNext();
    }
  };

  return (
    <Box
      style={{
        position: "fixed", // Fixed position to stay centered
        top: "50%", // Center vertically
        left: "50%", // Center horizontally
        transform: "translate(-50%, -50%)", // Adjust for height/width to truly center
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "2rem",
        borderRadius: "8px",
        width: "60vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        color: "#fff",
        fontSize: "1.2rem",
        textAlign: "center",
      }}
    >
      {response === null ? (
        <>
          {/* Conditionally render the image only if it is not null */}
          {image && <img src={image} alt="Question" style={{ width: "200px", height: "auto" }} />}
          <p>{question}</p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => handleResponse(1)}
              style={{
                padding: "0.8rem 1.2rem",
                fontSize: "1rem",
                backgroundColor: "#007bff", // blue background
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {option1}
            </button>
            <button
              onClick={() => handleResponse(2)}
              style={{
                padding: "0.8rem 1.2rem",
                fontSize: "1rem",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {option2}
            </button>
          </div>
        </>
      ) : (
        <>
          <p
            style={{
              color: response === "success" ? "#28a745" : "#dc3545",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            {response === "success" ? successText : failureText}
          </p>
          <button
            onClick={response === "success" ? handleNext : onRetry} // Adjust logic for next or retry
            style={{
              padding: "0.8rem 1.2rem",
              fontSize: "1rem",
              backgroundColor: response === "success" ? "#ffc107" : "#dc3545",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            {response === "success" ? "Next" : "Retry"}
          </button>
        </>
      )}
    </Box>
  );
};
