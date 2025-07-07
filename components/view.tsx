"use client";

import { useCounts } from "@/lib/hooks/use-count";
import PlusBtn from "./plus-btn";
import PlusOneStatus from "./plus-one-status";

export default function View() {
  const countState = useCounts();

  return (
    <>
      <PlusOneStatus {...countState} />
      <PlusBtn isError={Boolean(countState.error)} />
    </>
  );
}
