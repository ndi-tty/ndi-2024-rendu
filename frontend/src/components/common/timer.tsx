import { useRef, useState } from "react";
import "./timer.css";
import {
  ColorFormat,
  CountdownCircleTimer,
} from "react-countdown-circle-timer";

interface TimerProps {
  isPlaying: boolean;
  colors: ColorFormat;
}

const renderTime = ({ remainingTime }: any) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? "down" : ""}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

const Timer: React.FC<TimerProps> = ({ isPlaying, colors }) => {
  return (
    <CountdownCircleTimer
      isPlaying={isPlaying}
      duration={180}
      colors={colors}
      trailColor="#D9D9D9"
      onComplete={() => {
        // do your stuff here
        return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
      }}
    >
      {renderTime}
    </CountdownCircleTimer>
  );
};

export default Timer;
