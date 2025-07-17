import { NextRequest } from "next/server";
import { getClientIP } from "../utils/get-client-ip";
import { isLocalTest } from "../utils/is-local-test";
import { plusOneService } from "../services/plus-one.service";
import { PlusOneServiceStatus } from "../contants/types/plus-one";
import { buildAPIResponse } from "../utils/build-response";

export async function handlePlusOneCallback(req: NextRequest) {
  const ip = getClientIP(req);
  const now = new Date().toISOString();

  // 로컬에서 테스트할 경우 무조건 통과
  const plusOneServiceResult = await plusOneService({
    ip,
    now,
    isDev: isLocalTest(ip),
  });

  switch (plusOneServiceResult.status) {
    case PlusOneServiceStatus.SUCCESS:
      return buildAPIResponse({
        success: true,
        status: 200,
        message: "플러스원 성공!",
      });
    case PlusOneServiceStatus.CREATE_LOG_ERROR:
      console.error(plusOneServiceResult.error);
      return buildAPIResponse({
        success: false,
        status: 500,
        message: "클릭 로그 생성 실패",
      });
    case PlusOneServiceStatus.UPDATE_LAST_CLICKED_ERROR:
      console.error(plusOneServiceResult.error);
      return buildAPIResponse({
        success: false,
        status: 500,
        message: "클릭 시간 업데이트 실패",
      });
    case PlusOneServiceStatus.GET_UUID_ERROR:
      console.error(plusOneServiceResult.error);
      return buildAPIResponse({
        success: false,
        status: 401,
        message: "사용자 인증 실패",
      });
    case PlusOneServiceStatus.INVALID_SESSION:
      console.warn(plusOneServiceResult.warn);
      return buildAPIResponse({
        success: false,
        status: 440,
        message: "유효하지 않은 세션",
      });
    case PlusOneServiceStatus.GET_SESSION_ERROR:
      console.error(plusOneServiceResult.error);
      return buildAPIResponse({
        success: false,
        status: 500,
        message: "세션 정보 조회 실패",
      });

    case PlusOneServiceStatus.TOO_EARLY:
      const {
        hoursLeft: h,
        minutesLeft: m,
        secondsLeft: s,
      } = plusOneServiceResult.remainTimeStatus;
      return buildAPIResponse({
        success: false,
        status: 429,
        message: `아직 플러스원 할 수 없습니다. 남은 시간: ${h}시간 ${m}분 ${s}초`,
      });
    default:
      return buildAPIResponse({
        success: false,
        status: 500,
        message: "알 수 없는 에러",
      });
  }
}
