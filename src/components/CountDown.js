import React, { useState, useEffect } from "react";
import { Header } from "semantic-ui-react";

const initialCountDown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
};

function computeCountDown(date) {
  const now = Date.now();
  const distance = date.getTime() - now;

  if (distance < 0) {
    return initialCountDown;
  } else {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }
}

// November 16, 2019 3PM
function useCountDown(date = new Date(2019, 10, 16, 15)) {
  const [countDown, setCountDown] = useState(() => computeCountDown(date));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountDown(computeCountDown(date));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [date]);

  return countDown;
}

export default function CountDown() {
  const { days, hours, minutes, seconds } = useCountDown();

  return (
    <Header
      inverted
      size="medium"
      as="h3"
    >{`${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`}</Header>
  );
}
