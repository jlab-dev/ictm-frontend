# ICTM App — 정보통신장비 유지보수 관리 시스템

React Native(Expo) 기반의 정보통신장비(ICT) 점검 및 유지보수 관리 웹/모바일 앱입니다.
Spring Boot 백엔드, PostgreSQL DB와 연동되어 동작합니다.

---

## 전체 아키텍처

```
[React Native 웹앱]          [Spring Boot 백엔드]         [PostgreSQL DB]
localhost:8083      ←→      localhost:8082         ←→    localhost:15432
  (ictm-frontend)                (ictm)                    (Docker)
```

---

## 주요 기능

| 기능                                                | 상태                |
| --------------------------------------------------- | ------------------- |
| JWT 기반 로그인/인증                                | ✅ 완료             |
| 로그인 상태 유지 (AsyncStorage)                     | ✅ 완료             |
| 역할 기반 접근 제어 (ADMIN / INSPECTOR)             | ✅ 완료             |
| 반응형 레이아웃 (데스크탑 사이드바 / 모바일 드로어) | ✅ 완료             |
| 대시보드 화면                                       | ✅ 완료 (mock data) |

| JWT 인증 헤더로 API 요청 | ❌ 미구현 |

---

## 기술 스택

### 프론트엔드

| 항목             | 내용                        |
| ---------------- | --------------------------- |
| Framework        | React Native (Expo ~54)     |
| Routing          | Expo Router v6 (file-based) |
| State Management | React Context API           |
| HTTP Client      | Axios 1.14                  |
| Storage          | AsyncStorage                |
| Language         | TypeScript 5.9 (strict)     |
| React            | 19.1.0                      |

### 백엔드 (별도 레포)

| 항목      | 내용                   |
| --------- | ---------------------- |
| Framework | Spring Boot            |
| Auth      | JWT (24시간 만료)      |
| DB        | PostgreSQL 16 (Docker) |
| Password  | BCrypt 암호화          |

---

## 설치 및 실행

### 사전 준비

아래 항목들이 먼저 설치되어 있어야 합니다.

| 항목           | 버전    | 확인 방법       |
| -------------- | ------- | --------------- |
| Node.js        | 18 이상 | `node -v`       |
| npm            | 9 이상  | `npm -v`        |
| Docker Desktop | 최신    | `docker -v`     |
| Git            | 최신    | `git --version` |
| VS Code        | 최신    | -               |

> iOS 빌드는 Mac + Xcode 필요, Android 빌드는 Android Studio 필요

---

### Step 1. 레포 클론

```bash
git clone https://github.com/jlab-dev/ictm-frontend.git
cd ictm-frontend
```

### Step 2. 의존성 설치

```bash
npm install
```

### Step 3. 백엔드 DB 실행 (ictm 백엔드 프로젝트에서)

백엔드 프로젝트에서 Docker로 PostgreSQL을 먼저 띄웁니다.

```bash
# ictm 백엔드 프로젝트 폴더에서 실행
docker-compose up -d
```

실행 확인:

```bash
docker ps
# postgres 컨테이너가 Up 상태인지 확인
```

### Step 4. 백엔드 서버 실행 (ictm 백엔드 프로젝트에서)

```bash
# ictm 백엔드 프로젝트에서
./gradlew bootRun

# 또는 IntelliJ에서 IctmApplication.java 실행
```

`localhost:8082`에서 Spring Boot가 실행되면 준비 완료입니다.

### Step 5. 프론트엔드 실행

```bash
# 웹 브라우저 (가장 일반적)
npm run web

# Android 에뮬레이터
npm run android

# iOS 시뮬레이터 (Mac 전용)
npm run ios

# 플랫폼 직접 선택
npm start (추천)


실행 후 브라우저에서 `http://localhost:8083` 접속



---

### 전체 실행 순서 한눈에 보기

```

1. Docker Desktop 켜기
   ↓
2. ictm 백엔드 폴더 → docker-compose up -d
   ↓
3. ictm 백엔드 폴더 → Spring Boot 서버 실행
   ↓
4. ictm-frontend 폴더 → npm install (최초 1회)
   ↓
5. ictm-frontend 폴더 → npm run web
   ↓
6. 브라우저에서 http://localhost:8083 접속

````

### 종료 방법

```bash
# 앱 종료
Ctrl + C

# DB 컨테이너 종료 (ictm 백엔드 폴더에서)
docker-compose down
````

---

## 파일 구조 및 역할

> **직접 수정하는 파일**은 `⭐`, Expo 기본 제공 파일은 `—` 로 표시

```
ictm-frontend/
│
├── features/                        ⭐ 핵심 폴더 — 화면별 로직이 모두 여기에 있음
│   ├── auth/
│   │   └── AuthContext.tsx          ⭐ 로그인 상태 전역 관리 (로그인/로그아웃/토큰)
│   ├── login/
│   │   └── LoginScreen.tsx          ⭐ 로그인 화면 UI + 로직
│   ├── dashboard/
│   │   └── DashboardScreen.tsx      ⭐ 대시보드 화면 (통계 카드, 최근 점검/장비)
│
├── app/                             — Expo Router 진입점 (URL 경로 담당)
│   ├── _layout.tsx                  ⭐ 앱 전체 루트 레이아웃 + 로그인 여부 체크
│   ├── login.tsx                    — /login 경로 → LoginScreen으로 연결
│   ├── (app)/                       — 로그인한 사용자만 접근 가능한 경로 그룹
│   │   ├── _layout.tsx              — AppLayout 감싸는 레이아웃
│   │   ├── index.tsx                — / 경로 → DashboardScreen으로 연결
│   └── (tabs)/                      — Expo 초기 템플릿 잔여 파일 (사용 안 함)
│
├── components/                      — 재사용 가능한 UI 컴포넌트
│   ├── layout/
│   │   ├── AppLayout.tsx            ⭐ 반응형 레이아웃 (데스크탑: 사이드바 / 모바일: 헤더)
│   │   └── Sidebar.tsx              ⭐ 왼쪽 사이드바 (메뉴, 유저 정보, 로그아웃)
│   └── ui/
│       ├── Badge.tsx                ⭐ 역할 표시 뱃지 (ADMIN / INSPECTOR)
│       ├── Button.tsx               ⭐ 공통 버튼
│       ├── Card.tsx                 ⭐ 카드 컨테이너 (CardHeader, CardContent 등)
│       ├── Input.tsx                ⭐ 텍스트 입력 필드
│       ├── collapsible.tsx          — 접기/펼치기 컴포넌트 (Expo 템플릿)
│       └── icon-symbol.tsx          — SF Symbol 아이콘 (iOS용, Expo 템플릿)
│
├── constants/
│   └── theme.ts                     ⭐ 전체 색상 테마 정의 (라이트/다크/사이드바)
│
├── lib/
│   └── api.ts                       ⭐ Axios 인스턴스 (백엔드 baseURL 설정)
│
├── hooks/                           — Expo 기본 제공 훅
│   ├── use-color-scheme.ts          — 다크/라이트 모드 감지
│   └── use-theme-color.ts           — 테마 색상 가져오기
│
├── assets/images/                   — 앱 아이콘, 스플래시 이미지
│
├── app.json                         — Expo 앱 설정 (이름, 아이콘, 플러그인 등)
├── package.json                     — 의존성 목록 및 실행 스크립트
├── tsconfig.json                    — TypeScript 설정
└── eslint.config.js                 — ESLint 설정
```

### 새 화면을 추가할 때

1. `features/새화면/새화면Screen.tsx` 생성 — 실제 UI/로직 작성
2. `app/(app)/새화면.tsx` 생성 — 한 줄 re-export만 작성

```typescript
// app/(app)/새화면.tsx
export { default } from "@/features/새화면/새화면Screen";
```

---

## 로그인 흐름

```
1. localhost:8083 접속
        ↓
2. 로그인 상태 없음 → /login 자동 이동
        ↓
3. 아이디/비밀번호 입력 후 로그인 버튼 클릭
        ↓
4. POST http://localhost:8082/api/v1/auth/login
        ↓
5. JWT 토큰 발급 → AsyncStorage 저장
        ↓
6. 대시보드로 자동 이동
        ↓
7. 다음 접속 시 저장된 토큰으로 자동 로그인
```

### 테스트 계정 (백엔드 자동 생성)

| 계정       | 비밀번호  | 역할      |
| ---------- | --------- | --------- |
| admin      | admin1234 | ADMIN     |
| inspector1 | test1234  | INSPECTOR |

---

## 환경 설정

API 서버 주소는 [lib/api.ts](lib/api.ts)에서 변경합니다.

```typescript
// lib/api.ts
baseURL: "http://localhost:8082/api/v1";
```

---

## 화면 구성

| 화면     | 경로     | 설명                                   |
| -------- | -------- | -------------------------------------- |
| 로그인   | `/login` | 아이디/비밀번호 입력, 에러 메시지 표시 |
| 대시보드 | `/`      | 장비 수, 점검 현황, 리포트 통계        |

> **데스크탑** (768px 이상): 사이드바 고정 표시
> **모바일**: 상단 헤더 + 햄버거 메뉴 드로어
