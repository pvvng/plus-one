"use client";

import { useEffect, useState } from "react";

export interface RemainTime {
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  canClick: boolean;
}

export function useRemainTime() {
  const [remainTime, setRemainTime] = useState<RemainTime | null>(null);

  const initRemainTime = () => {
    setRemainTime({
      hoursLeft: 24,
      minutesLeft: 0,
      secondsLeft: 0,
      canClick: false,
    });
  };

  useEffect(() => {
    const fetchRemainTime = async () => {
      try {
        const res = await fetch("/api/remain");
        const json = await res.json();
        setRemainTime(json.data);
      } catch (e) {
        console.error("남은 시간 불러오기 실패:", e);
      }
    };
    fetchRemainTime();
  }, []);

  useEffect(() => {
    if (!remainTime || remainTime.canClick) return;

    const interval = setInterval(() => {
      setRemainTime((prev) => {
        if (!prev) return null;

        let { hoursLeft, minutesLeft, secondsLeft } = prev;

        if (hoursLeft === 0 && minutesLeft === 0 && secondsLeft === 0) {
          return { ...prev, canClick: true };
        }

        if (secondsLeft > 0) {
          secondsLeft--;
        } else {
          secondsLeft = 59;
          if (minutesLeft > 0) {
            minutesLeft--;
          } else {
            minutesLeft = 59;
            if (hoursLeft > 0) hoursLeft--;
          }
        }

        return { hoursLeft, minutesLeft, secondsLeft, canClick: false };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainTime]);

  return { remainTime, initRemainTime };
}
