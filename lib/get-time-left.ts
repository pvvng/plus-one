import { ONE_DAY_MS } from "@/constant";

export function getTimeLeftUntil24Hours(diffMs: number) {
  const msLeft = ONE_DAY_MS - diffMs;
  const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((msLeft % (1000 * 60)) / 1000);

  return {
    hoursLeft,
    minutesLeft,
    secondsLeft,
  };
}
