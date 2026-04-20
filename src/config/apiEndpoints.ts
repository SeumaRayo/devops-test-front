export const API_BASE_URL: string = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/signup',
    LOGOUT: '/v1/auth/logout',
  },
} as const;
