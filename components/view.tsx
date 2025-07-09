"use client";

import { useCounts } from "@/lib/hooks/use-count";
import { usePlusOne } from "@/lib/hooks/use-plus-one";
import { useRemainTime } from "@/lib/hooks/use-remain-time";
import PlusBtn from "./plus-btn";
import PlusOneStatus from "./plus-one-status";

export default function View() {
  const countState = useCounts();
  const { remainTime, initRemainTime } = useRemainTime();
  const { trigger, isLoading } = usePlusOne({ onSuccess: initRemainTime });

  return (
    <>
      <PlusOneStatus {...countState} />
      <PlusBtn
        isLoading={isLoading}
        isError={Boolean(countState.error)}
        canClick={remainTime?.canClick ?? true}
        hoursLeft={remainTime?.hoursLeft ?? 0}
        minutesLeft={remainTime?.minutesLeft ?? 0}
        secondsLeft={remainTime?.secondsLeft ?? 0}
        onClick={trigger}
      />
    </>
  );
}
