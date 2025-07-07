# 플러스원! (Plus One)

> 재미와 기술을 결합한 간단한 카운팅 프로젝트.  
> 하루에 한 번만 누를 수 있는 "플러스원!" 버튼을 통해 숫자가 올라가며, 실시간으로 결과가 반영됩니다.


## 🚀 데모

> 👉 [https://plus-one-wine.vercel.app/]


## 🛠️ 기술 스택

- **Next.js 14 (App Router)**
- **Supabase Realtime Database**
- **React + Tailwind CSS + GSAP**
- **Server-Sent Events (SSE)**
- **Google reCAPTCHA v3**
- **FingerprintJS** – 사용자 식별


## 📦 주요 기능

### ✅ 1. **하루에 한 번만 누를 수 있는 플러스원 버튼**

- IP + Fingerprint 조합으로 사용자 제한
- 같은 사용자는 24시간 이내 중복 클릭 불가

### ✅ 2. **Supabase Realtime 기반 실시간 카운트 반영**

- 버튼 클릭 시 Supabase DB의 count_logs 추가. 이를 집계하여 플러스원 갯수 체크
- 다른 사용자의 화면에도 **실시간 반영 (Server-Sent Events 기반)**

### ✅ 3. **Google reCAPTCHA v3 봇 방지**

- 봇 트래픽 차단
- 클릭 전 invisible reCAPTCHA로 사용자 행동 검증

### ✅ 4. **FingerprintJS를 통한 사용자 식별**

- IP 주소 외에도 브라우저 기반의 고유 식별자(Fingerprint)를 사용해
  하루 1회 제한을 보다 정밀하게 적용


## 📡 실시간 업데이트 구조 (SSE + Supabase Realtime)

1. 사용자가 버튼 클릭 → API 호출 → Supabase DB 업데이트
2. Supabase Realtime이 DB 변화 감지
3. 클라이언트는 **SSE 채널을 통해 변화 감지** → 실시간으로 숫자 업데이트
