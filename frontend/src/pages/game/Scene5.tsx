import { Box, Flex } from "@radix-ui/themes";
import Back from "../../assets/game/scene5.png";
import { useNavigate } from "react-router-dom";

export async function action() {}

export async function loader() {
  const boxesResponse = await fetch("http://localhost:3000/iot");
  const monitorResponse = await fetch("http://localhost:3000/monitor");
  const monitor = await monitorResponse.json();
  const boxes = await boxesResponse.json();
  return { boxes, monitor };
}

export default function Scene5() {
  const navigate = useNavigate(); // Use React Router's navigate hook

  return (
    <div>
      <Box className="main" style={{ position: "relative", overflow: "hidden" }}>
        <Flex
          gap="4"
          wrap="wrap"
          direction="column"
          style={{
            position: "relative",
            width: "100%",
            height: "100vh", // Fill the viewport height
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(${Back})`, // Background image
            backgroundSize: "cover", // Ensure background fills the screen
            backgroundPosition: "center",
          }}
        >
          <Box
            style={{
              zIndex: 100,
              textAlign: "center",
              color: "#fff", // Text color for better visibility
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional background for contrast
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h1>Une fois Bob vaincu, tu te lance sur les flots à l'aide de son navire... Toute ces nouvelles connaissances vont te permettre à ton corps de ne faire qu'un avec l'ocean. </h1>
            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/scene-6")} // Navigate to the first scene
            >
              Naviguer
            </button>
          </Box>
        </Flex>
      </Box>
    </div>
  );
}
