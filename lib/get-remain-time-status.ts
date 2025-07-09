import { ONE_DAY_MS } from "@/constant";
import { getTimeLeftUntil24Hours } from "./get-time-left";

export function getRemainTimeStatus(clickAt: string) {
  const now = new Date();
  const prevClick = new Date(clickAt);
  const diff = now.getTime() - prevClick.getTime();

  return {
    ...getTimeLeftUntil24Hours(diff),
    canClick: diff >= ONE_DAY_MS,
  };
}
