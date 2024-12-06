import React from "react";
import { Box, Flex } from "@radix-ui/themes";
import Bar from "../assets/faq/bar.png";
import Pirate1 from "../assets/faq/pirate1.png";
import PirateTextSprite from "../assets/faq/pirate-text-sprite.png";
import PirateTextHead from "../assets/faq/pirate-text-head.png";
import Pirate6Head from "../assets/faq/pirate6-head.png";
import Pirate6 from "../assets/faq/pirate6.png";
import Pirate8Head from "../assets/faq/pirate8-head.png";
import Pirate8 from "../assets/faq/pirate8.png";
import Monkey from "../assets/faq/monkey-3.gif";
import MonkeyHead from "../assets/faq/monkey-head.png";
import "./css/faq.css";
import { Interact } from "../components/faq/interact";
export interface Detail {
  title: string;
  description: string;
}


const FAQ: React.FC = () => {
  
const details: Detail[][] = [[
  {
    title: "Pourquoi le choix des captchas gamifiés ?",
    description:
      "Cette année nous avons décidé de mettre en place des captchas gamifiés puisque nous avions de bonnes idées (flappy bird, ou est charlie), l'implementation de ce code c'est fait par Charley et Sylvain, deux de nos meilleurs pirates !",
  },
  {
    title: "Flappy bird captcha ? comment ca !",
    description:
      "ARrrrrr !!! Le choix des captchas vous laisse la possibiliter de commencer par jouer contre un flappy bird enrager, si vous réussissez à dépasser un score de 1250 vous pourrez au captcha restant ! Ce jeu à totallement été codé par Charley en React et Nest.js. En mettant en place un système de score et de sauvegarde des scores en base de données ainsi qu'une verification complete coté backend du fonctionnement du jeu afin d'éviter toute triche de jeune corsairs malicieux !",
  },
  {
    title: "Ou est charlie?",
    description:
      "Il n'est pas la ... Arrrrr !!! Ce captcha vous embarque dans le célèbre jeu ou est charlie, vous devrez trouver charlie parmis une foule de pirate, si vous réussissez à le trouver vous pourrez prouver que vous n'êtes pas un robot et continuer votre aventure ! Ce jeu implementé par notre pirate Sylvain en React et Nest.js, vous permettra de vous amuser tout en prouvant que vous n'êtes pas un robot !",
  },
],
[
  {
    title: "Ah Oh oh oh OHH ?",
    description:
      "Oooh oh oh oh ah oooh oh oh oh ah",
  },
  {
    title: "Ooh ooh ah ah ?",
    description:
      "Oooh ooh ah ah oooh oh oh oh ah",
  },
],
[
  {
    title: "Notre remake de Monkey Island !",
    description:
      "Après avoir choisi le thème de la FAQ nous avons décidé de réutiliser les mêmes mécaniques dans le jeu pour le sujet principal sur le lien entre l'ocean et le corps humain. YAARRRRR ! Un sujet qui colle autant on ne pouvait pas s'en passer en tant que pirates !!!!!!! Nous avons créer une petite aventure interactive afin de guider l'utilisateur à travers des questions qui le feront comprendre le lien étroit entre le corps humain et l'ocean !",
  },
  {
    title: "FAQ Monkey Island !!!",
    description:
      "GRRRRR, nous sommes des pirates dans l'âme, à l'annonce du sujet nous avons totallement accroché avec cette idée tordue de mélanger Monkey Island et une FAQ !!! L'univers décallé de Monkey Island nous a permis de créer des personnages haut en couleur et des dialogues qui nous ressemblent !",
  },
  {
    title: "Ollama ou Capitaine ???!!!",
    description:
      "En petit bonus et pour rajouter une touche de créativité nous avons déployé Ollama sur notre cluster de production avec un modèle mistral 7B qui vous repondra comme un pirate si vous osez poser une question au Capitaine Smirk. C'est notre vaillant corsaire Thomas qui c'est chargé de toute la partie Monkey Island sur ce site !",
  },
],
[
  {
    title: "PIRATE BINOCLAR !!!",
    description:
      "Notre vaillant Martin le Marin a su naviguer à travers les flots de logs et les vagues de metrics pour répondre à un défi sur de l'observabilité ! Tout en gardant un oeil sur les traces laissées par les différentes parties de notre application, il a su mettre en place un système de monitoring complet pour que notre équipage puisse naviguer en toute sécurité !",
  },
  {
    title: "Gouvernail à tribord !!! KUBERNETES À lA RESCOUSSE !!!",
    description:
      "Notre production tourne entierrement sur un cluster Kubernetes, Arrr il ne faut pas mettre le gouvernail d'helm et kubernetes entre nos mais si vous voulez garder vos tresors intactes !!!! ",
  },
]];


  return (
    <Box className="main" style={{ position: "relative", overflow: "hidden" }}>
      <h1 style={{marginBottom: 0, marginTop: 0}}>Welcome to the Great Pirate Island themed FAQ !</h1>
      <Flex
        gap="4"
        wrap="wrap"
        direction="column"
        style={{ position: "relative", width: "100%", height: "auto" }}
      >
        <img
          src={Bar}
          alt="logo"
          style={{
            position: "relative",
            zIndex: "0",
            width: "100%",
            objectFit: "contain",
          }}
        />
        <Interact sprite={Pirate1} coords={{x:400, y: -240}} popupText="Vieil homme: Je suis vieux mais je peux te jurer que j'arrive quand même à faire des Captchas !!! Je ne suis pas encore un robot quand meme !" isUsingPrompt={false} size="5" title="Shopkeeper" details={details[0]} />
        <Interact sprite={Monkey} coords={{x: -350, y: -200}} popupImage={MonkeyHead} popupText="Singe à 3 têtes: Ooh ooh ah ah! 🐒" isUsingPrompt={false}  size="4"title="Three headed monkey" details={details[1]}/>
        <Interact sprite={Pirate6} popupImage={Pirate6Head} coords={{x: -320, y: -140}} popupText="Elaine Marley: YARR Qui va la !? Oh simplement toi ? j'imagine que tu cherches à en apprendre plus sur le défi monkey island !" isUsingPrompt={false}  size="5"title="Elaine Marley" details={details[2]}/>
        <Interact sprite={Pirate8} popupImage={Pirate8Head} coords={{x: 440, y: -130}} popupText="Carla: mmmh laisse moi deviner, tu souhaite en apprendre plus sur l'observabilité dans notre application ?" isUsingPrompt={false}  size="6"title="Carla" details={details[3]}/>
        <Interact sprite={PirateTextSprite} coords={{x: 30, y: -175}} popupText="Captain Smirk: So you have some harder questions for me young kid (ce capitaine très intelligent (mistral mdr) ne te repondra qu'en anglais !!!)?"  popupImage={PirateTextHead} isUsingPrompt={true}  size="7"title="Captain Smirk" details={details[4]}/>
        {/* <Interact sprite={Pirate1} coords={{x: -300, y: -100}} /> */}
      </Flex>
    </Box>
  );
};

export default FAQ;
