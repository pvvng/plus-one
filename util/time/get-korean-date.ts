import moment from "moment-timezone";

/** 한국시 ISO Date String 반환 함수 */
export function getKoreanDate(): string {
  const timezone = "Asia/Seoul";
  const todayKST = moment().tz(timezone).format();
  return todayKST;
}
