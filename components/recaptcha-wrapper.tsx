"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

/** recaptch provider wrapper */
const GoogleCaptcha = ({ children }: { children: React.ReactNode }) => {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
      scriptProps={{
        id: "recaptcha-script",
        async: true,
        defer: true,
      }}
      language="ko" // 한국어로 설정
      useEnterprise={true} // 엔터프라이즈 버전 사용
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default GoogleCaptcha;
