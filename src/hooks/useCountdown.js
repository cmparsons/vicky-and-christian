import { useState, useEffect } from "react";

const initialCountDown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
};

export default function useCountDown(date = new Date(2019, 10, 16, 15)) {
  const [countDown, setCountDown] = useState(initialCountDown);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = date - now;

      if (distance < 0) {
        setCountDown(initialCountDown);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountDown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [date]);

  return countDown;
}
