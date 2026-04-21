export interface ForgotPasswordRequest {
  correoAcceso: string;
}

export interface ResetPasswordRequest {
  token: string;
  passwordNueva: string;
}

export interface PasswordResetResponse {
  message: string;
  success: boolean;
}
