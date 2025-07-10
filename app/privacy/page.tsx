import Link from "next/link";

// privacy page (개인정보 처리방침)
export const metadata = {
  title: "개인정보 처리방침",
  description:
    "플러스원 서비스에서 수집하는 개인정보와 처리 방침에 대해 안내합니다.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-screen-xl mx-auto py-12 px-5 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-paperlogy min-h-screen">
      <h1 className="text-2xl font-bold mb-4">개인정보 처리방침</h1>
      <p className="text-xs text-neutral-500 mb-2">시행일자: 2025년 7월 7일</p>
      <Link
        href="/"
        className="mb-8 block text-xs text-blue-500 hover:text-blue-600"
      >
        메인화면으로
      </Link>

      <section className="space-y-6">
        <article>
          <h2 className="font-semibold text-base mb-2">
            1. 수집하는 개인정보 항목
          </h2>
          <p>
            플러스원!(이하 “서비스”)은 회원가입, 고객상담, 서비스 제공 등을 위해
            다음과 같은 개인정보를 수집할 수 있습니다.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>기본정보: IP 주소, 브라우저 정보, 접속 일시</li>
            <li>선택정보: 이메일, 닉네임 등 사용자가 자발적으로 입력한 정보</li>
          </ul>
        </article>

        <article>
          <h2 className="font-semibold text-base mb-2">
            2. 개인정보의 수집 및 이용 목적
          </h2>
          <p>서비스는 수집한 개인정보를 다음의 목적에 한해 사용합니다:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>이용자 인증 및 부정 이용 방지</li>
            <li>서비스 개선 및 통계 분석</li>
            <li>법령에 따른 보관 및 의무 이행</li>
          </ul>
        </article>

        <article>
          <h2 className="font-semibold text-base mb-2">
            3. 개인정보의 보유 및 이용 기간
          </h2>
          <p>
            서비스는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체
            없이 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우에는 일정
            기간 보관할 수 있습니다.
          </p>
        </article>

        <article>
          <h2 className="font-semibold text-base mb-2">
            4. 개인정보 제3자 제공
          </h2>
          <p>
            서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않으며,
            아래의 경우에 한하여 제공할 수 있습니다:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 의거하거나 수사기관의 요청이 있는 경우</li>
          </ul>
        </article>

        <article>
          <h2 className="font-semibold text-base mb-2">
            5. 개인정보 보호를 위한 기술적·관리적 대책
          </h2>
          <p>
            서비스는 개인정보 보호를 위하여 다음과 같은 조치를 취하고 있습니다:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>접근 권한 최소화 및 암호화</li>
            <li>비인가 접근 방지를 위한 보안 시스템 운영</li>
          </ul>
        </article>

        <article>
          <h2 className="font-semibold text-base mb-2">6. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 자신의 개인정보에 대해 조회, 수정, 삭제를 요청할
            수 있습니다. 요청은 이메일(gdongu093@gmail.com)로 접수할 수
            있습니다.
          </p>
        </article>

        <article>
          <h2 className="font-semibold text-base mb-2">
            7. 개인정보 보호책임자
          </h2>
          <p>
            서비스는 개인정보 보호를 위해 책임자를 지정하고 있습니다. 개인정보
            관련 문의는 아래로 연락 주시기 바랍니다.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>이름: pvvng</li>
            <li>이메일: gdongu093@gmail.com</li>
          </ul>
        </article>
      </section>

      <p className="mt-10 text-xs text-neutral-500">
        본 개인정보 처리방침은 관련 법령 및 회사 정책에 따라 변경될 수 있으며,
        변경 시 웹사이트에 사전 고지됩니다.
      </p>
    </main>
  );
}
