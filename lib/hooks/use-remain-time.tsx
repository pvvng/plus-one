"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getRemainTimeStatus } from "../../util/time/get-remain-time-status";

export interface RemainTime {
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  canClick: boolean;
}

type SessionData = {
  id: string | undefined;
  clickedAt: string | undefined;
};

const INITIAL_REMAIN_TIME = {
  hoursLeft: 24,
  minutesLeft: 0,
  secondsLeft: 0,
  canClick: false,
};

export function useRemainTime({ devMode = false }: { devMode?: boolean } = {}) {
  const [remainTime, setRemainTime] = useState<RemainTime>(INITIAL_REMAIN_TIME);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const lastUpdateRef = useRef(performance.now());
  const rafIdRef = useRef<number>(null);

  const initRemainTime = useCallback(
    (_canClick = false) => {
      setRemainTime({
        hoursLeft: 24,
        minutesLeft: 0,
        secondsLeft: 0,
        canClick: devMode ? true : _canClick,
      });
    },
    [devMode]
  );

  useEffect(() => {
    const fetchRemainTime = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/session");
        const json = await res.json();
        const session: SessionData = json.data;

        if (!session.clickedAt) return initRemainTime(true);
        const remainStatus = getRemainTimeStatus(session.clickedAt);
        setRemainTime({
          ...remainStatus,
          canClick: devMode ? true : remainStatus.canClick,
        });
      } catch (e) {
        console.error("남은 시간 불러오기 실패:", e);
        initRemainTime(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRemainTime();
  }, [devMode]);

  useEffect(() => {
    if (!remainTime || remainTime.canClick) return;
    if (devMode) return;

    const updateRemainTime = () => {
      setRemainTime((prev) => {
        if (!prev) return INITIAL_REMAIN_TIME;

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
    };

    const tick = (time: number) => {
      if (time - lastUpdateRef.current >= 1000) {
        updateRemainTime();
        lastUpdateRef.current = time;
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [remainTime, devMode]);

  return { remainTime, isLoading, initRemainTime };
}
