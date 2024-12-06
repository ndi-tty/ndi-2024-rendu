import React, { useState } from "react";
import { Box } from "@radix-ui/themes";

interface PromptPopupProps {
  text?: string;
  imageSrc?: string; // Optional image source
}

export const PromptPopup: React.FC<PromptPopupProps> = ({ text, imageSrc }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse("");
    setIsLoading(true);

    const url = "https://ollama.moreiradj.net/api/generate"; // Adjust the URL if needed

    const payload = {
      model: "mistral:latest",
      prompt: `You are a pirate from Monkey Island, answer the following question like so: ${prompt}`,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done && reader) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.response) {
                setResponse((prev) => prev + json.response);
              }
            } catch (err) {
              console.error("Failed to parse JSON chunk:", line, err);
            }
          }
        }
      }
      setResponse((prev) => prev + "\n--- Stream ended ---");
    } catch (error: any) {
      setResponse(`Request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: `translate(-50%, ${imageSrc ? -150 : -300}%)`,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "2rem",
        borderRadius: "8px",
        width: "60vw",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        color: "#fff",
      }}
    >
      {/* Text or Response */}
      <Box style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
        <Box style={{ marginBottom: "2rem", fontSize: "1.2rem", width: "80%" }}>
          {response || text}
        </Box>

        {/* Image */}
        {imageSrc && (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={imageSrc}
              alt="Popup Image"
              style={{
                width: "200px",
                height: "auto",
                objectFit: "cover",
              }}
            />
              <Box style={{ marginBottom: "2rem", fontSize: "1.2rem", marginTop: "10px" }}>
              Captain Smirk
            </Box>
          </Box>
        )}
    </Box>
      {/* Input and Submit Button */}
      <form onSubmit={handleFormSubmit}>
        <textarea
          id="prompt"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        ></textarea>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "En cours, (on a pas de gpu soyez patient)..." : "Demander"}
        </button>
      </form>
    </Box>
  );
};
