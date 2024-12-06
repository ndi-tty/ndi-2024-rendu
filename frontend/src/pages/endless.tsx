import { useState } from "react";
import WhereIsCharlie from "../components/games/where-is-charlie";

const EndlessWaldo = () => {
  const [key, setKey] = useState(0);

  const handleGameWon = () => {
    setTimeout(() => {
      setKey((prevKey) => prevKey + 1);
    }, 3000);
  };

  return <WhereIsCharlie key={key} emitGameWon={handleGameWon} />;
};

export default EndlessWaldo;
