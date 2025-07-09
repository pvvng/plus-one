import { ONE_DAY_MS } from "@/constant";

export function getTimeLeftUntil24Hours(diffMs: number) {
  let msLeft = ONE_DAY_MS - diffMs;
  // 음수 방어
  msLeft = Math.max(msLeft, 0);

  const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((msLeft % (1000 * 60)) / 1000);

  return {
    hoursLeft,
    minutesLeft,
    secondsLeft,
  };
}
