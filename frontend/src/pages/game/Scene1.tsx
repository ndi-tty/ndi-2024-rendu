import { Box, Flex } from "@radix-ui/themes";
import Back from "../../assets/game/scene1.png";
import Pirate1 from "../../assets/faq/pirate1.png";
import Compass from "../../assets/game/compass.png";
import Wood from "../../assets/game/wood.png";

import "../css/faq.css";
import { Interact } from "../../components/faq/interact";
import { ChoicePopupProps } from "../../components/faq/choice-popup";
import { useState } from "react";
export interface Detail {
  title: string;
  description: string;
}

export async function action() { }

export async function loader() {
  const boxesResponse = await fetch("http://localhost:3000/iot");
  const monitorResponse = await fetch("http://localhost:3000/monitor");
  const monitor = await monitorResponse.json();
  const boxes = await boxesResponse.json();
  return { boxes, monitor };
}

export default function Scene1() {

  const [current_question, setCurrentQuestion] = useState(0);

  const incrementQuestion = () => {
    console.log("incrementing question");
    console.log(choices[0][current_question]);
    setCurrentQuestion(current_question + 1);
  }

  const choices: ChoicePopupProps[][] = [[
      {
        question: "Arrr mon ami, c'est la premiere fois que tu viens sur cette ile maudite ?",
        option1: "Non",
        option2: "Oui",
        successText: "Oh oh oh, tu vas bien t'amuser jeune pirate, mais avant tout repond à ces petites questions!",
        failureText: "Mauvaise reponse!",
        correctOption: 2,
      },
      {
        question: "Saviez-tu que l'océan régule le climat de la Terre comme notre corps régule la température ?",
        option1: "Non",
        option2: "Oui",
        successText: "Exactement ! L'océan est comme les poumons de notre planète, maintenant l'équilibre.",
        failureText: "Le rôle de l'océan dans la régulation du climat est essentiel, tout comme notre corps maintient notre vie.",
        correctOption: 2,
      },
      {
        question: "Et si l'océan était comme un cœur humain, pompant des nutriments vitaux à travers ses courants ?",
        option1: "Non",
        option2: "Oui",
        successText: "Exactement ! Comme notre sang circule dans le corps, les courants océaniques sont cruciaux pour la vie.",
        failureText: "Le système de circulation de l'océan est le cœur de la planète, alimentant les écosystèmes.",
        correctOption: 2,
      },
      {
        question: "Oh Oh Oh tu me sembles bien renseigné jeune pirate Souhaites tu continuer ton aventure ? je te previens ca ne sera pas de tout repos!",
        option1: "OUIIIII",
        option2: "Non",
        successText: "Alors ALLONS Y !",
        failureText: "... Tu n'as pas le choix  ",
        correctOption: 1,
        is_next: 2,
      },
    ]
  ];

  return (
    <Box className="main" style={{ position: "relative", overflow: "hidden" }}>
      <Flex
        gap="4"
        wrap="wrap"
        direction="column"
        style={{ position: "relative", width: "100%", height: "auto" }}
      >
        <img
          src={Back}
          alt="logo"
          style={{
            position: "relative",
            zIndex: "0",
            width: "100%",
            objectFit: "contain",
          }}
        />
        <Interact sprite={Pirate1} coords={{ x: 0, y: -280 }} popupText="Shopkeeper: Hey yasdasdoung pirate" size="5" title="Old man" details={[]} isChoicePopup={true} choices={choices[0][current_question]} onNext={() => {incrementQuestion()}}/>
        <Interact sprite={Compass} coords={{ x: -900, y: -380 }} popupText="Une belle boussole elle pourait être utile plus tard !" size="3" title="" details={[]}/>
        <Interact sprite={Wood} coords={{ x: 800, y: -480 }} popupText="Du bois c'est tout, à quoi tu t'attendais" size="3" title="" details={[]}/>
        
      </Flex>
    </Box>
  );
};
