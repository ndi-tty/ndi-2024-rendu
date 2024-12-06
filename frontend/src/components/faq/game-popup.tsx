import React, { useState } from "react";
import { Box } from "@radix-ui/themes";
import { Detail } from "../../pages/faq";

interface PopupProps {
  text?: string;
  imageSrc?: string; // Optional image source
  details?: Detail[]; // List of title and description objects
}

export const Popup: React.FC<PopupProps> = ({ text, imageSrc, details = [] }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
        alignItems: "center",
        gap: "1rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        color: "#fff",
        fontSize: "1.2rem",
      }}
    >
        
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <p>{text}</p>
        {details.map((detail, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #555",
              padding: "1rem",
              cursor: "pointer",
              color: expandedIndex === index ? "#ffd700" : "#fff", // Highlight expanded title
              transition: "color 0.2s ease-in-out",
            }}
            onClick={() => toggleExpand(index)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {detail.title}
              </span>
              <span
                style={{
                  transform: expandedIndex === index ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                ▶
              </span>
            </div>
            {expandedIndex === index && (
              <p
                style={{
                  marginTop: "0.5rem",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  color: "#ddd",
                }}
              >
                {detail.description}
              </p>
            )}
          </div>
        ))}
      </div>
      {imageSrc && (
        <Box
          style={{
            flexShrink: 0,
            width: "200px",
            height: "auto",
          }}
        >
          <img
            src={imageSrc}
            alt="Popup Image"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </Box>
      )}
      
    </Box>
  );
};
