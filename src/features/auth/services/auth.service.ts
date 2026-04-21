import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import { LoginRequest, SignUpRequest, AuthResponse } from '../types/auth.types';
import { ResetPasswordRequest, PasswordResetResponse } from '../types/passwordReset.types';

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
  },

  requestPasswordReset: async (email: string): Promise<PasswordResetResponse> => {
    const response = await axiosInstance.post<PasswordResetResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { correoAcceso: email });
    return response.data;
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<PasswordResetResponse> => {
    const response = await axiosInstance.post<PasswordResetResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
    return response.data;
  }
};
