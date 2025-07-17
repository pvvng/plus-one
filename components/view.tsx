"use client";

import { useCounts } from "@/lib/fe/hooks/use-count";
import PlusBtn from "./plus-btn";
import PlusOneStatus from "./plus-one-status";
import { useRemainTime } from "@/lib/fe/hooks/use-remain-time";
import { usePlusOne } from "@/lib/fe/hooks/use-plus-one";

export default function View() {
  const devMode = process.env.NODE_ENV === "development";

  const countState = useCounts();
  const {
    remainTime,
    isLoading: isRemainTimeLoading,
    initRemainTime,
  } = useRemainTime({ devMode: false });
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
