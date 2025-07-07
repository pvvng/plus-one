"use client";

import { useEffect, useState } from "react";

const redirectUrl =
  "https://github.com/pvvng/plus-one/issues/new?template=bug_report.yml";

export default function ReportPage() {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const ok = window.confirm(
      "GitHub 이슈 페이지로 이동하여 버그를 제보하시겠습니까?"
    );

    if (ok) {
      setConfirmed(true); // 상태 업데이트 → UI 표시용
      window.location.href = redirectUrl;
    } else {
      // 사용자가 취소를 선택한 경우
      window.location.href = "/"; // 홈으로 리다이렉트
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen font-paperlogy">
      <p className="text-lg">
        {confirmed
          ? "버그 리포트 페이지로 이동 중입니다..."
          : "잠시만 기다려주세요..."}
      </p>
    </div>
  );
}
