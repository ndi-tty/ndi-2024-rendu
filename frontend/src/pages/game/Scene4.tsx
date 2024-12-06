import { Box, Flex } from "@radix-ui/themes";
import Back from "../../assets/game/scene3.png";
import Pirate9 from "../../assets/faq/pirate9.png"
import PirateTextSprite from "../../assets/faq/pirate-text-sprite.png"
import PirateTextHead from "../../assets/faq/pirate-text-head.png"
import Banana from "../../assets/game/banana.png"
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
      question: "Ahoy, JE SUIS BOB !!! Le plus grand pirate de tout les temps !!! (enfin de mon vivant...) Qu'est ce que tu fais dans la calle de ce navire ?",
      option1: "J'essayais de dormir avant que tu hurles !",
      option2: "ZzzzZZZzzzzzZZZZZz",
      successText: "Oh pardon je t'ai reveillé ?! NON JE RIGOLE AH AH AH AH AH TU CROIS QUE JE VAIS M'EXCUSER ? C'est PLUTOT A TOI DE T'E... *Bob continue de parler pendant 10 minutes*",
      failureText: "REVEILLE TOI *Envoie un coup de pied dans le ventre de notre hero*",
      correctOption: 1,
    },
    {
      question: "Bon venons en au fait... Je dois te poser ces satanés questions moi aussi (c'est litteralement ma seule raison d'être) alors allons y !",
      option1: "On pourrait simplement discuter d'autre chose non ?",
      option2: "Oui, elles transportent la vie tout comme notre sang !",
      successText: "Parfait alors allons y",
      failureText: "... C'est la nuit de l'info, j'ai pas le temps pour tes conneries",
      correctOption: 2,
    },
    {
      question: "Les pigeons sont t ils des robots du gouvernement ?",
      option1: "Oui ... ne le dit pas trop fort",
      option2: "...",
      successText: "Tu as tout compris, les pigeons sont des robots espions du gouvernement, ils sont partout, tout le temps, et ils nous surveillent !",
      failureText: "Sois honnête, tu as déjà vu un pigeon faire quelque chose d'intelligent ?",
      correctOption: 1,
    },
    {
      question: "Si l'océan était une grande rivière qui irrigue le monde, que dirais-tu des océans profonds, comme des organes internes cachés ?",
      option1: "Ce n'est pas pareil, c'est trop étrange !",
      option2: "Oui, les océans profonds sont comme des organes secrets qui régulent notre planète !",
      successText: "Tu as percé le secret ! Les océans profonds jouent un rôle caché mais essentiel pour maintenir l'équilibre de notre planète, comme des organes vitaux !",
      failureText: "Arrgh, c'est un concept fondamental ! Sans les océans profonds, tout le système serait perturbé, comme un corps sans organes vitaux !",
      correctOption: 2,
    },
    {
      question: "Argh, tu sembles bien avisé ! Maintenant, tu sais que l'océan et le corps humain sont liés par des forces mystérieuses. Prêt à embarquer pour la dernière étape de cette aventure ?",
      option1: "Oui, Cap'tain ! Embarquons !",
      option2: "Non, c'est assez pour moi !",
      successText: "Alors, hissons les voiles et allons de l'avant !",
      failureText: "Pas de répit pour un pirate, tu n'as pas le choix ! Suis-moi ou reste là, c'est ton dernier choix.",
      correctOption: 1,
      is_next: 5, // Transition vers la dernière scène
    },
  ]];
  

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
        <Interact sprite={Pirate9} coords={{ x: -200, y: -120 }} popupText="Bob" size="8" title="Bob" details={[]} isChoicePopup={true} choices={choices[0][current_question]} onNext={() => {incrementQuestion()}}/>
        <Interact sprite={Banana} coords={{ x: 800, y: -380 }} popupText="Une bonne banane, ca fait toujours plaisir ..." size="3" title="" details={[]}/>
        <Interact sprite={PirateTextSprite} coords={{x: 220, y: -175}} popupText="Captain Smirk: So you have some harder questions for me young kid (ce capitaine très intelligent (mistral mdr) ne te repondra qu'en anglais !!!)?"  popupImage={PirateTextHead} isUsingPrompt={true}  size="7"title="Captain Smirk" details={[]}/>
      
      </Flex>
    </Box>
  );
};
