import { Box, Flex } from "@radix-ui/themes";
import Back from "../../assets/game/scene2.png";
import Pirate8 from "../../assets/faq/pirate8.png";
import Wood from "../../assets/game/wood.png";
import Pirate8Head from "../../assets/faq/pirate8-head.png";
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

export default function Scene2() {

  const [current_question, setCurrentQuestion] = useState(0);

  const incrementQuestion = () => {
    console.log("incrementing question");
    console.log(choices[0][current_question]);
    setCurrentQuestion(current_question + 1);
  }

  const choices: ChoicePopupProps[][] = [[
      {
        question: "Tiens tiens tiens, qui voila, tu pensais vraiment pouvoir t'aventurer plus loin sans m'affronter ?",
        option1: "Oui",
        option2: "Non",
        successText: "Mouahahahah dans cette ile tout n'est que question, si tu veux vraiment comprendre le lien entre le corps humain et la mer tu vas devoir t'accrocher!",
        failureText: "... comment tu savais ?",
        correctOption: 1,
        image: Pirate8Head,
      },
      {
        question: "Penses-tu que la montée des eaux due au changement climatique soit comme une fièvre pour l'océan, jeune pirate ?",
        option2: "Non, Cap'tain, c’est une légende !",
        option1: "Oui, tout comme une fièvre, l'océan souffre !",
        successText: "Arrr, tu as raison ! Comme une fièvre qui fait souffrir un pirate, la montée des eaux affecte toute la planète, et l'océan est en détresse.",
        failureText: "L'océan souffre, comme un pirate malade, la montée des eaux est un signe que quelque chose ne va pas dans notre monde.",
        correctOption: 1,
        image: Pirate8Head,
      },
      {
        question: "Les coraux sont t ils des extraterestes ?",
        option1: "Non, ça me paraît fou !",
        option2: "Oui, ils viennent de mars en réalité !",
        successText: "Arrr, tu as bien saisi ! Les coraux forment des structures vivantes qui soutiennent des milliers d'espèces, tout comme nos cellules sont essentielles pour la vie.",
        failureText: "Les coraux sont les petites cellules de l'océan, jeunes pirate, sans eux, tout l'écosystème marin s'effondrerait, tout comme ton corps sans tes cellules !",
        correctOption: 2,
        image: Pirate8Head,
      },
      {
        question: "Arrrrrrr je n'ai plus de question !!!!!! Comment vais je faire ?????? Peut etre que je vais devoir retourner à l'ecole des pirate après tout... Je n'ai jamais fini ma license en piraterie et c'est peut etre un signe du destin !",
        option1: "Oui dégage !",
        option2: "Non l'ecole ne sert à rien regarde moi !",
        successText: "Je vais suivre tes conseils !",
        failureText: "(Bienveillance avant tout)",
        correctOption: 2,
        image: Pirate8Head,
        is_next: 3,
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
        <Interact sprite={Pirate8} popupImage={Pirate8Head} coords={{ x: 0, y: -280 }} popupText="Shopkeeper: Hey young pirate" size="5" title="Clara" details={[]} isChoicePopup={true} choices={choices[0][current_question]} onNext={() => {incrementQuestion()}}/>
        <Interact sprite={Wood} coords={{ x: 800, y: -780 }} popupText="Du bois c'est tout, à quoi tu t'attendais" size="3" title="" details={[]}/>
          
      </Flex>
    </Box>
  );
};
