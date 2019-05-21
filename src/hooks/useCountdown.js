import { useState, useEffect } from "react";

const initialCountDown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
};

function computeCountDown(date) {
  const now = new Date().getTime();
  const distance = date - now;

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

export default function useCountDown(date = new Date(2019, 10, 16, 15)) {
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
