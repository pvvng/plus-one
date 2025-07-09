"use client";

import { useEffect, useState } from "react";
import { getRemainTimeStatus } from "../get-remain-time-status";

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

  const initRemainTime = (_canClick = false) => {
    setRemainTime({
      hoursLeft: 24,
      minutesLeft: 0,
      secondsLeft: 0,
      canClick: devMode || _canClick,
    });
  };

  useEffect(() => {
    const fetchRemainTime = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/session");
        const json = await res.json();
        const session: SessionData = json.data;

        // 세션 자체가 없거나, 클릭 기록이 없음
        // = 최초 접속 -> 바로 클릭 가능
        if (!session.clickedAt) return initRemainTime(true);

        // 세션 clickedAt 기반으로 남은 시간 계산
        const remainStatus = getRemainTimeStatus(session.clickedAt);
        return setRemainTime({
          ...remainStatus,
          canClick: devMode ? true : remainStatus.canClick,
        });
      } catch (e) {
        console.error("남은 시간 불러오기 실패:", e);
        // 오류가 나도 그냥 클릭 가능하게 처리
        return initRemainTime(true);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchRemainTime();
  }, []);

  const updateRemainTime = (prev: RemainTime) => {
    if (!prev) return INITIAL_REMAIN_TIME;

    // 개발 모드일때는 항상 클릭 가능
    if (devMode) {
      return { ...prev, canClick: true };
    }

    let { hoursLeft, minutesLeft, secondsLeft } = prev;

    // 타이머 종료
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
  };

  useEffect(() => {
    if (!remainTime || remainTime.canClick) return;
    if (devMode) return;

    const interval = setInterval(() => {
      setRemainTime(updateRemainTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainTime, devMode]);

  return { remainTime, isLoading, initRemainTime };
}
