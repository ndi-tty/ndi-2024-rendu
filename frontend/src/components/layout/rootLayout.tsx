import { gray, blue, slate } from "@radix-ui/colors";
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Flex, Box, Heading, Text, Separator } from "@radix-ui/themes";
import PirateLogo from "../../assets/pirate.png";
import NuitInfoLogo from "../../assets/nuit-info.svg";
import { FaHeart } from "react-icons/fa";

const theme = {
  backgroundColor: slate.slate12,
  headerBackground: blue.blue8,
  navBackground: slate.slate11,
  color: gray.gray1,
  linkColor: blue.blue5,
  IconBackground: gray.gray1,
};

const navLinkStyles = {
  color: "inherit",
  textDecoration: "none",
  display: "block",
  padding: "0.5rem",
};

const RootLayout: React.FC = () => {
  return (
    <Flex
      direction="column"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          padding: "2rem",
          backgroundColor: theme.headerBackground,
          display: "flex",
          width: "100%",
          zIndex: 1000,
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", // Added soft shadow with fading effect
        }}
      >
        <Flex align="center">
          <img
            src={PirateLogo}
            alt="logo"
            style={{ width: "60px", marginRight: "10px" }}
          />
          <Heading style={{ color: "white", fontSize: "3rem"}} as="h1">
            Nuit de l'info 2024
          </Heading>
        </Flex>
      </Box>
      <Flex direction="row" style={{ flex: 1, overflow: "hidden" }}>
        <Box
          style={{
            width: "300px",
            padding: "1rem",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <NavLink to="/" style={navLinkStyles as React.CSSProperties}>
                Accueil
              </NavLink>
            </li>

            <li>
              <NavLink to="/faq" style={navLinkStyles as React.CSSProperties}>
                Monkey Island (FAQ)
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/flappy-bird"
                style={navLinkStyles as React.CSSProperties}
              >
                CAPTCHA (Flappy Bird)
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/where-is-charlie"
                style={navLinkStyles as React.CSSProperties}
              >
                CAPTCHA (Where Is Charlie?)
              </NavLink>
            </li>
            <Separator orientation="horizontal" size="4" />

            <li>
              <NavLink to="/team" style={navLinkStyles as React.CSSProperties}>
                L'équipe
              </NavLink>
            </li>
          </ul>
        </Box>
        <Box
          style={{
            flex: 1,
            padding: "1rem",
            backgroundColor: "white",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Flex>
      <Box style={{ padding: "1rem", backgroundColor: theme.headerBackground,
          boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.5)", // Added soft shadow with fading effect

       }}>
        <Flex justify="between" align="center">
          <Flex align="center">
            <img
              src={NuitInfoLogo}
              alt="logo"
              style={{ width: "40px", marginRight: "10px" }}
            />
            <Heading as="h2" style={{ color: "white" }}>
              Nuit de l'info 2024
            </Heading>
          </Flex>
          <Text as="div" style={{ color: "white", textAlign: "right" }}>
            Made with {<FaHeart color="red" size={15} />} by{" "}
            {<NavLink to="/team">TTY team</NavLink>}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default RootLayout;
