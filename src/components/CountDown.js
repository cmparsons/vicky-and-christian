import React, { useState, useEffect } from "react";
import { Header } from "semantic-ui-react";

const initialCountDown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
};

// November 16, 2019 3PM
const weddingDate = new Date(2019, 10, 16, 15);

function computeCountDown(distance) {
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

function useCountDown(date, start) {
  const [countDown, setCountDown] = useState(() =>
    computeCountDown(date - start)
  );

  useEffect(() => {
    let now = start;
    const intervalId = setInterval(() => {
      now += 1000;
      setCountDown(computeCountDown(date - now));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [date, start]);

  return countDown;
}

export default function CountDown({
  date = weddingDate.getTime(),
  start = Date.now()
}) {
  const { days, hours, minutes, seconds } = useCountDown(date, start);

  return (
    <Header
      inverted
      size="medium"
      as="h3"
    >{`${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`}</Header>
  );
}
