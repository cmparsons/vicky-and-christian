import React from "react";
import { Header } from "semantic-ui-react";

import useCountDown from "../hooks/useCountdown";

export default function CountDown() {
  const { days, hours, minutes, seconds } = useCountDown();

  return (
    <Header
      inverted
      size='medium'
    >{`${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`}</Header>
  );
}
