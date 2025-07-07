import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const GoogleCaptcha = ({ children }: { children: React.ReactNode }) => {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
      scriptProps={{ async: true, defer: true }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default GoogleCaptcha;
