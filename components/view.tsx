"use client";

import { useCounts } from "@/lib/hooks/use-count";
import { usePlusOne } from "@/lib/hooks/use-plus-one";
import { useRemainTime } from "@/lib/hooks/use-remain-time";
import PlusBtn from "./plus-btn";
import PlusOneStatus from "./plus-one-status";

export default function View() {
  const countState = useCounts();
  const {
    remainTime,
    isLoading: isRemainTimeLoading,
    initRemainTime,
  } = useRemainTime();
  const { trigger, isLoading: isPlusOneLoading } = usePlusOne({
    onSuccess: initRemainTime,
  });

  return (
    <>
      <PlusOneStatus {...countState} />
      <PlusBtn
        isLoading={isRemainTimeLoading || isPlusOneLoading}
        isError={Boolean(countState.error)}
        {...remainTime}
        onClick={trigger}
      />
    </>
  );
}
