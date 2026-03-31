/**
 * api.ts — Axios HTTP 클라이언트 설정
 *
 * 백엔드 서버와 통신할 때 사용하는 axios 인스턴스를 만들어두는 파일입니다.
 * 모든 API 요청은 이 인스턴스를 통해 보냅니다.
 *
 * 사용 예시:
 *   import api from '@/lib/api';
 *   const response = await api.post('/auth/login', { username, password });
 *   → 실제로는 http://localhost:8082/api/v1/auth/login 으로 요청이 나감
 */

import axios from 'axios';

const api = axios.create({
  // 모든 요청의 기본 주소 — 백엔드 서버 주소
  // 다른 환경(배포 서버 등)으로 바꾸려면 이 주소만 수정하면 됩니다
  baseURL: 'http://localhost:8082/api/v1',

  headers: {
    // 요청 본문(body)을 JSON 형식으로 보내겠다고 서버에 알려주는 헤더
    'Content-Type': 'application/json',
  },
});

export default api;
