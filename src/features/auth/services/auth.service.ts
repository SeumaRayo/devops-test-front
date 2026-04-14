import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import { LoginRequest, SignUpRequest, AuthResponse } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData: SignUpRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  }
};
