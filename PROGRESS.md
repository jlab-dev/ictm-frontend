# 지금까지 한 것 정리

## 전체 구조

```
[React Native 웹앱]          [Spring Boot 백엔드]         [PostgreSQL DB]
localhost:8083      ←→      localhost:8082         ←→    localhost:15432
  (ictm-app)                    (ictm)                    (Docker)
```

웹 브라우저에서 React Native 앱을 열면, 앱이 Spring Boot 서버에 HTTP 요청을 보내고,
Spring Boot는 PostgreSQL DB에서 데이터를 꺼내서 응답해요.

---

## 1. Docker로 DB 띄우기

PostgreSQL DB는 직접 설치한 게 아니라 **Docker 컨테이너**로 실행해요.

```bash
docker-compose up -d
```

`docker-compose.yml` 설정:
```yaml
postgres:16 이미지 사용
포트: 내 PC의 15432 → 컨테이너 안의 5432
DB 이름: ictm
계정: ictm / ictm1234
```

Spring Boot는 `application-local.yml`에서 이 DB에 접속해요:
```yaml
url: jdbc:postgresql://localhost:15432/ictm
username: ictm
password: ictm1234
```

---

## 2. CORS 설정 (WebConfig.java)

**CORS가 필요한 이유:**
브라우저는 보안상 다른 포트로 요청을 기본적으로 막아요.

- React Native 웹앱: `localhost:8083`
- Spring Boot 서버: `localhost:8082`

포트가 다르면 브라우저가 "다른 출처(Cross-Origin)"로 판단하고 요청을 차단해요.
`WebConfig.java`에서 8083에서 오는 요청을 허용하도록 설정했어요.

```java
registry.addMapping("/api/**")          // /api/ 로 시작하는 모든 경로
        .allowedOrigins("http://localhost:8083")  // 이 주소에서 오는 요청 허용
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
        .allowedHeaders("*")            // 모든 헤더 허용 (JWT 토큰 포함)
        .allowCredentials(true);
```

> **참고:** React Native 네이티브 앱(iOS/Android)은 브라우저가 아니라서 CORS가 필요 없어요.
> 지금은 웹 브라우저에서 보고 있어서 필요한 거예요.

---

## 3. 백엔드 로그인 구조

### 전체 흐름

```
POST /api/v1/auth/login
{ "username": "admin", "password": "admin1234" }
        ↓
  AuthController        → 요청 받기
        ↓
  AuthService           → 비즈니스 로직 처리
        ↓
  MemberRepository      → DB에서 유저 조회
        ↓
  PasswordEncoder       → 비밀번호 검증
        ↓
  JwtUtil               → JWT 토큰 생성
        ↓
응답: { "token": "eyJ...", "username": "admin", "role": "ADMIN" }
```

### 파일별 역할

#### `domain/Member.java` — 회원 테이블 정의
```java
id        → 자동 증가 숫자 (PK)
username  → 아이디 (중복 불가)
password  → 비밀번호 (BCrypt 암호화된 상태로 저장)
role      → 역할 (ADMIN 또는 INSPECTOR)
```
JPA가 이 클래스를 보고 `members` 테이블을 자동으로 만들어줘요.

#### `domain/MemberRepository.java` — DB 조회
```java
findByUsername(String username)
// → "SELECT * FROM members WHERE username = ?" 쿼리를 자동 생성
```

#### `dto/LoginRequest.java` — 로그인 요청 데이터
```java
username  → 프론트에서 보낸 아이디
password  → 프론트에서 보낸 비밀번호
```
HTTP 요청 body의 JSON을 이 객체로 자동 변환해줘요.

#### `dto/LoginResponse.java` — 로그인 응답 데이터
```java
token     → 발급한 JWT 토큰
username  → 아이디
role      → 역할
```

#### `service/AuthService.java` — 핵심 로직
```
1. username으로 DB에서 회원 조회
   → 없으면 "아이디 또는 비밀번호가 올바르지 않습니다." 오류

2. 입력한 비밀번호와 DB의 암호화된 비밀번호 비교
   → 다르면 동일한 오류 (어디가 틀렸는지 알려주지 않음 - 보안상)

3. JWT 토큰 생성 후 반환
```

#### `util/JwtUtil.java` — JWT 토큰 처리
JWT(JSON Web Token)는 로그인 성공 후 발급하는 "입장권" 같은 거예요.
```
토큰 안에 담긴 정보:
- sub: "admin"          → 누구의 토큰인지
- role: "ADMIN"         → 역할
- iat: 발급 시각
- exp: 만료 시각 (24시간 후)

이 정보는 서버의 비밀키로 서명되어 있어서 위조 불가능해요.
```

#### `config/SecurityConfig.java` — Spring Security 설정
```
/api/v1/auth/**  → 누구나 접근 가능 (로그인 API니까)
그 외 모든 경로  → 인증 필요 (JWT 토큰 있어야 함)

세션 사용 안 함 (STATELESS) → 서버가 로그인 상태를 저장하지 않음
                              → JWT 토큰으로만 인증 확인
```

#### `config/DataInitializer.java` — 테스트 계정 자동 생성
앱 시작할 때 DB가 비어있으면 자동으로 테스트 계정 2개를 만들어요.
```
admin      / admin1234  → ADMIN 역할
inspector1 / test1234   → INSPECTOR 역할

비밀번호는 BCrypt로 암호화해서 저장 (DB에 plain text로 저장 안 함)
```

---

## 4. 프론트엔드 로그인 구조

### 설치한 라이브러리
```
axios                            → HTTP 요청 (fetch보다 편함)
@react-native-async-storage      → 토큰 저장 (웹/iOS/Android 전부 동작)
```

### 파일별 역할

#### `lib/api.ts` — axios 기본 설정
```typescript
baseURL: 'http://localhost:8082/api/v1'
// 모든 API 요청의 기본 주소
// api.post('/auth/login') → http://localhost:8082/api/v1/auth/login 으로 요청
```

#### `context/AuthContext.tsx` — 로그인 상태 관리
앱 전체에서 "지금 누가 로그인되어 있는지" 관리하는 곳이에요.

```
앱 시작 시:
  AsyncStorage에서 저장된 token/username/role 불러오기
  → 있으면 자동 로그인 상태로 설정

login(username, password):
  1. 백엔드에 POST /auth/login 요청
  2. 응답받은 token/username/role을 AsyncStorage에 저장
  3. user 상태 업데이트
  4. 홈 화면으로 이동

logout():
  1. AsyncStorage에서 token/username/role 삭제
  2. user 상태를 null로 초기화
  3. 로그인 화면으로 이동
```

**AsyncStorage란?**
- 웹의 `localStorage`와 비슷한 개념
- 앱을 껐다 켜도 데이터가 유지됨
- 웹에서는 실제로 `localStorage`를 사용함

#### `app/login.tsx` — 로그인 화면
```
아이디 입력창 + 비밀번호 입력창 + 로그인 버튼

로그인 버튼 클릭 시:
  1. 입력값 검증 (비어있으면 오류 메시지)
  2. AuthContext의 login() 호출
  3. 성공 → 홈 화면으로 자동 이동
  4. 실패 → 오류 메시지 표시
```

#### `app/_layout.tsx` — 라우팅 보호
```
앱이 처음 켜질 때:
  로그인 안 된 상태 → /login 으로 자동 이동
  로그인 된 상태   → /(tabs) 홈으로 자동 이동

로그인 화면에서 로그인 성공 시:
  → /(tabs) 홈으로 자동 이동
```

---

## 5. 로그인 전체 흐름 요약

```
1. 브라우저에서 localhost:8083 접속
        ↓
2. _layout.tsx: 로그인 상태 확인 → 없음
        ↓
3. /login 화면으로 자동 이동
        ↓
4. 아이디/비밀번호 입력 후 로그인 버튼 클릭
        ↓
5. axios로 POST http://localhost:8082/api/v1/auth/login 요청
        ↓
6. Spring Boot: DB에서 유저 조회 → 비밀번호 검증 → JWT 토큰 생성
        ↓
7. 응답: { token: "eyJ...", username: "admin", role: "ADMIN" }
        ↓
8. AsyncStorage에 token/username/role 저장
        ↓
9. /(tabs) 홈 화면으로 자동 이동
        ↓
10. 다음에 앱 열 때 AsyncStorage에서 token 불러와서 자동 로그인
```

---

## 현재 상태

| 항목 | 상태 |
|------|------|
| DB (Docker PostgreSQL) | ✅ 완료 |
| CORS 설정 | ✅ 완료 |
| 로그인 API (`POST /api/v1/auth/login`) | ✅ 완료 |
| JWT 토큰 발급 | ✅ 완료 |
| 테스트 계정 자동 생성 | ✅ 완료 |
| React Native 로그인 화면 | ✅ 완료 |
| 로그인 상태 관리 (AuthContext) | ✅ 완료 |
| 로그아웃 | ❌ 미구현 |
| JWT 토큰으로 인증된 API 요청 | ❌ 미구현 |
| 점검 관련 기능 | ❌ 미구현 |
