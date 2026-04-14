export const API_BASE_URL: string = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/signup',
    LOGOUT: '/auth/logout',
  },
} as const;
