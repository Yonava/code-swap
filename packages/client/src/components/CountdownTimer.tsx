import { useEffect, useState } from "react";

export type CountdownTimerProps = {
  /**
   * unix timestamp in milliseconds of when the countdown should reach 0:00
   */
  timeAtZero: number;
};

export const CountdownTimer = ({ timeAtZero }: CountdownTimerProps) => {
  const [msLeft, setMsLeft] = useState(() => Math.max(0, timeAtZero - Date.now()));


  useEffect(() => {
    const newMsLeft = Math.max(0, timeAtZero - Date.now());
    setMsLeft(newMsLeft);

    const interval = setInterval(() => {
      const newMsLeft = Math.max(0, timeAtZero - Date.now());
      setMsLeft(newMsLeft);

      if (newMsLeft === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeAtZero]);

  const totalSeconds = Math.floor(msLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds.toString().padStart(2, "0");

  return (
    <div className="font-bold text-2xl">
      <span>
        {minutes}:{paddedSeconds}
      </span>
    </div>
  );
};
