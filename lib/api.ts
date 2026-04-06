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

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  // 모든 요청의 기본 주소 — 백엔드 서버 주소
  // 다른 환경(배포 서버 등)으로 바꾸려면 이 주소만 수정하면 됩니다
  baseURL: 'http://localhost:8082/api/v1',

  headers: {
    // 요청 본문(body)을 JSON 형식으로 보내겠다고 서버에 알려주는 헤더
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터 — 모든 요청 헤더에 JWT 토큰을 자동으로 첨부합니다.
 * 웹: localStorage, 앱: AsyncStorage에서 토큰을 읽어 Authorization: Bearer <token> 형태로 추가합니다.
 */
api.interceptors.request.use(async (config) => {
  const token = Platform.OS === 'web'
    ? localStorage.getItem('token')
    : await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
