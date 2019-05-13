import React from "react";
import useCountDown from "../hooks/useCountdown";

export default function CountDown() {
  const { days, hours, minutes, seconds } = useCountDown();

  return (
    <p>{`${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`}</p>
  );
}
