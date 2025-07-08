<img src="https://github.com/user-attachments/assets/eeecb14e-8b86-4db1-9baa-4253ec0800d3" width="10%" />

# 플러스원! (Plus One)

> 재미와 기술을 결합한 간단한 카운팅 프로젝트.  
> 하루에 한 번만 누를 수 있는 "플러스원!" 버튼을 통해 숫자가 올라가며, 실시간으로 결과가 반영됩니다.

## 🚀 데모

👉 [https://plus-one-wine.vercel.app/](https://plus-one-wine.vercel.app/)

## 🛠️ 기술 스택

- **Next.js 14 (App Router)**
- **Supabase Realtime Database**
- **React + Tailwind CSS + GSAP**
- **Server-Sent Events (SSE)**
- **Google reCAPTCHA v3**
- **Iron Session** – 사용자 세션 기반 식별

## 📦 주요 기능

#### ✅ 1. **하루에 한 번만 누를 수 있는 플러스원 버튼**

- **클릭 시 고유 세션 ID 생성 후 쿠키 저장**
- 해당 세션은 Supabase에 저장되며, 24시간 이내 중복 클릭 방지
- IP 기반 부정 사용도 일부 차단

#### ✅ 2. **Supabase Realtime 기반 실시간 카운트 반영**

- 버튼 클릭 시 Supabase DB의 `click_logs`에 이벤트 기록
- 이를 집계하여 플러스원 총합을 계산
- 다른 사용자의 화면에도 **실시간 반영 (Server-Sent Events 기반)**

#### ✅ 3. **Google reCAPTCHA v3 봇 방지**

- 클릭 전 invisible reCAPTCHA를 실행하여 사용자가 사람인지 검증
- 의심스러운 경우 서버에서 차단

#### ✅ 4. **Iron Session 기반 사용자 식별**

- 초기 클릭 시 서버에서 UUID를 발급하고, 세션 쿠키로 저장
- 이후 모든 요청은 이 세션을 통해 사용자 식별 및 중복 클릭 여부 검증
- 세션은 24시간 후 만료됨

## 📡 실시간 업데이트 구조 (SSE + Supabase Realtime)

1. 사용자가 버튼 클릭 → reCAPTCHA 검증 → API 호출 → DB에 기록
2. Supabase Realtime이 DB 변화 감지
3. 클라이언트는 **SSE 채널을 통해 실시간 업데이트 감지** → 즉시 숫자 갱신
