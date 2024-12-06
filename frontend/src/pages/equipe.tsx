import React from "react";
import { Box, Flex, Card, Text, Heading, Avatar } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { IoIosSchool } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import Charley from "../assets/equipe/charley.jpeg";
import Sylvain from "../assets/equipe/sylvanus.jpeg";
import Martin from "../assets/equipe/martin.jpeg";
import Thomas from "../assets/equipe/thomas.jpeg";

const teamMembers = [
  {
    name: "Charley Geoffroy",
    github: "https://github.com/charley04310",
    linkedin: "https://linkedin.com/in/charley",
    img: Charley,
  },
  {
    name: "Sylvain Pierrot",
    github: "https://github.com/sylvain-pierrot",
    linkedin: "https://linkedin.com/in/sylvain",
    img: Sylvain,

  },
  {
    name: "Martin Moreira",
    github: "https://github.com/mmoreiradj",
    linkedin: "https://linkedin.com/in/martin",
    img: Martin,

  },
  {
    name: "Thomas Mauran",
    github: "https://github.com/thomas-mauran",
    linkedin: "https://www.linkedin.com/in/thomas-mauran-9238371b7?originalSubdomain=fr",
    img: Thomas,

  },
];

const linkStyles = {
  color: "inherit",
  textDecoration: "none",
};

const Equipe: React.FC = () => {
  return (
    <Box style={{ padding: "1rem" }}>
      <Heading as="h1">Notre équipe</Heading>
      <Text as="div" size="2" color="gray" style={{ marginBottom: "1rem" }}>
        Nous sommes une équipe d'étudiant de Polytech Montpellier passionnés par
        le développement et les technologies web.
      </Text>
      <Flex gap="4" wrap="wrap" direction="row" justify="center">
        {teamMembers.map((member) => (
          <Box key={member.name} maxWidth="650px" width="100%">
            <Card>
              <Flex gap="3" align="center">
                <Avatar
                  size="9"
                  src={member.img as string}
                  fallback={member.name.charAt(0)}
                  radius="small"
                />
                <Box>
                  <Heading
                    as="h2"
                    weight="bold"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    {member.name}
                  </Heading>

                  <Flex
                    align="center"
                    gap="2"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <IoIosSchool size={27} />
                    <Text as="div" size="2" color="gray">
                      Polytech Montpellier
                    </Text>
                  </Flex>

                  <Flex
                    align="center"
                    gap="2"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <FaGithub size={27} />
                    <Link
                      to={member.github}
                      style={linkStyles as React.CSSProperties}
                    >
                      GitHub
                    </Link>
                  </Flex>

                  <Flex align="center" gap="2">
                    <CiLinkedin size={27} />
                    <Link
                      to={member.linkedin}
                      style={linkStyles as React.CSSProperties}
                    >
                      LinkedIn
                    </Link>
                  </Flex>
                </Box>
              </Flex>
            </Card>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Equipe;
