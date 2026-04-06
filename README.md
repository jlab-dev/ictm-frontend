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
| 로그인 상태 유지 (web: localStorage / 앱: AsyncStorage) | ✅ 완료         |
| 역할 기반 접근 제어 (ADMIN / INSPECTOR)             | ✅ 완료             |
| 반응형 레이아웃 (데스크탑 사이드바 / 모바일 드로어) | ✅ 완료             |
| 대시보드 화면                                       | ✅ 완료 (mock data) |
| 공통코드 그룹 관리 (CRUD)                           | ✅ 완료 (API 연동)  |
| 공통코드 상세 관리 (CRUD)                           | ✅ 완료 (API 연동)  |
| 공지사항 관리                                       | ✅ 완료 (mock data) |
| GitHub Pages 정적 배포                              | ✅ 완료             |

---

## 기술 스택

### 프론트엔드

| 항목             | 내용                        |
| ---------------- | --------------------------- |
| Framework        | React Native (Expo ~54)     |
| Routing          | Expo Router v6 (file-based) |
| State Management | React Context API           |
| HTTP Client      | Axios 1.14                  |
| Storage          | AsyncStorage (앱) / localStorage (웹) |
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

| 항목           | 버전    | 확인 방법       |
| -------------- | ------- | --------------- |
| Node.js        | 18 이상 | `node -v`       |
| npm            | 9 이상  | `npm -v`        |
| Docker Desktop | 최신    | `docker -v`     |
| Git            | 최신    | `git --version` |

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

```bash
docker-compose up -d
docker ps  # postgres 컨테이너가 Up 상태인지 확인
```

### Step 4. 백엔드 서버 실행

```bash
./gradlew bootRun
# 또는 IntelliJ에서 IctmApplication.java 실행
```

`localhost:8082`에서 Spring Boot가 실행되면 준비 완료입니다.

### Step 5. 프론트엔드 실행

```bash
npm run web      # 웹 브라우저 (권장)
npm run android  # Android 에뮬레이터
npm run ios      # iOS 시뮬레이터 (Mac 전용)
npm start        # 플랫폼 직접 선택
```

브라우저에서 `http://localhost:8083` 접속

---

### 전체 실행 순서

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
```

### 종료 방법

```bash
Ctrl + C                  # 앱 종료
docker-compose down       # DB 컨테이너 종료 (백엔드 폴더에서)
```

---

## 파일 구조

> `⭐` 직접 수정하는 파일 / `—` Expo 기본 제공 파일

```
ictm-frontend/
│
├── features/                              ⭐ 핵심 폴더 — 화면별 로직
│   ├── auth/
│   │   └── AuthContext.tsx               ⭐ 로그인 상태 전역 관리 (로그인/로그아웃/토큰)
│   ├── login/
│   │   ├── LoginScreen.tsx               ⭐ 로그인 화면 JSX
│   │   ├── useLogin.ts                   ⭐ 로그인 로직 훅
│   │   └── LoginScreen.styles.ts         ⭐ 로그인 화면 스타일
│   ├── dashboard/
│   │   └── DashboardScreen.tsx           ⭐ 대시보드 화면
│   ├── commonCode/
│   │   ├── CommonCodeScreen.tsx          ⭐ 공통코드 화면 진입점 (탭 전환)
│   │   ├── types.ts                      ⭐ 타입 정의 + API 파싱 헬퍼
│   │   ├── useCommonCodeData.ts          ⭐ API 데이터 공유 훅
│   │   ├── group/
│   │   │   ├── GroupTab.tsx              ⭐ 코드 그룹 목록 UI
│   │   │   ├── useGroupTab.ts            ⭐ 그룹 탭 상태/로직
│   │   │   └── GroupTab.styles.ts        ⭐ 그룹 탭 스타일
│   │   ├── detail/
│   │   │   ├── DetailTab.tsx             ⭐ 코드 상세 목록 UI
│   │   │   ├── useDetailTab.ts           ⭐ 상세 탭 상태/로직
│   │   │   └── DetailTab.styles.ts       ⭐ 상세 탭 스타일
│   │   └── modals/
│   │       ├── GroupFormModal.tsx        ⭐ 그룹 등록/수정 모달 (mode prop)
│   │       ├── DetailFormModal.tsx       ⭐ 코드 등록/수정 모달 (mode prop)
│   │       └── ConfirmModal.tsx          ⭐ 삭제 확인 모달 (범용)
│   └── notice/
│       ├── NoticeScreen.tsx              ⭐ 공지사항 화면 JSX
│       ├── useNotice.ts                  ⭐ 공지 로직 훅 + mock 데이터
│       └── NoticeScreen.styles.ts        ⭐ 공지 화면 스타일
│
├── app/                                   — Expo Router 진입점 (URL 경로 담당)
│   ├── _layout.tsx                        ⭐ 앱 전체 루트 레이아웃 + 인증 체크
│   ├── login.tsx                          — /login 경로 → LoginScreen 연결
│   └── (app)/
│       ├── _layout.tsx                    — AppLayout 감싸는 레이아웃
│       ├── index.tsx                      — / 경로 → DashboardScreen 연결
│       ├── common-code.tsx                — /common-code → CommonCodeScreen 연결
│       └── notice.tsx                     — /notice → NoticeScreen 연결
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx                  ⭐ 반응형 레이아웃 (사이드바 / 모바일 헤더)
│   │   └── Sidebar.tsx                    ⭐ 왼쪽 사이드바
│   └── ui/
│       ├── Badge.tsx                      ⭐ 역할 표시 뱃지
│       ├── Button.tsx                     ⭐ 공통 버튼
│       ├── Card.tsx                       ⭐ 카드 컨테이너
│       ├── Input.tsx                      ⭐ 텍스트 입력 필드
│       └── ModalField.tsx                 ⭐ 모달 폼 레이블+입력 레이아웃 (공유)
│
├── constants/
│   ├── theme.ts                           ⭐ 색상/반경/간격 디자인 토큰
│   └── screenStyles.ts                    ⭐ 관리 화면 공통 스타일 (테이블, 버튼 등)
│
├── lib/
│   └── api.ts                             ⭐ Axios 인스턴스 (JWT 인터셉터 포함)
│
├── hooks/
│   ├── use-color-scheme.ts                — 다크/라이트 모드 감지
│   └── use-theme-color.ts                 — 테마 색상 가져오기
│
├── .github/workflows/deploy.yml           ⭐ GitHub Pages 자동 배포 (main 브랜치 push 시)
├── app.json                               ⭐ Expo 앱 설정 (baseUrl 등)
├── package.json                           — 의존성 및 실행 스크립트
└── tsconfig.json                          — TypeScript 설정
```

### 새 화면을 추가할 때

각 화면은 `Screen.tsx` / `useScreen.ts` / `Screen.styles.ts` 3파일 구조를 따릅니다.

1. `features/새화면/` 폴더 생성
2. `새화면Screen.tsx` — JSX만 작성
3. `use새화면.ts` — 상태와 로직
4. `새화면Screen.styles.ts` — `screenStyleDefs` spread 후 화면 전용 스타일 추가
5. `app/(app)/새화면.tsx` — 한 줄 re-export

```typescript
// app/(app)/새화면.tsx
export { default } from '@/features/새화면/새화면Screen';
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
5. JWT 토큰 발급 → localStorage(웹) / AsyncStorage(앱) 저장
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
baseURL: 'http://localhost:8082/api/v1'
```

---

## 화면 구성

| 화면           | 경로           | 설명                                        |
| -------------- | -------------- | ------------------------------------------- |
| 로그인         | `/login`       | 아이디/비밀번호 입력, 에러 메시지 표시      |
| 대시보드       | `/`            | 장비 수, 점검 현황, 리포트 통계 (mock)      |
| 공통코드 그룹  | `/common-code` | 그룹 목록 조회/등록/수정/삭제 (API 연동)    |
| 공통코드 상세  | `/common-code` | 상세 코드 조회/등록/수정/삭제 (API 연동)    |
| 공지사항       | `/notice`      | 공지 목록/등록/수정/삭제 (mock)             |

> **데스크탑** (768px 이상): 사이드바 고정 표시
> **모바일**: 상단 헤더 + 햄버거 메뉴 드로어

---

## 배포 (GitHub Pages)

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 후 `gh-pages` 브랜치에 배포합니다.

```
main push → npx expo export --platform web → gh-pages 브랜치 배포
```

배포 URL: `https://jlab-dev.github.io/ictm-frontend/`
