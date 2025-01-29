import { Observable } from 'rxjs';

export interface LoginByPhoneRequest {
  phoneNumber: string;
}

export interface LoginByPhoneResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  success: boolean;
  message: string;
}

export interface ValidateTokenRequest {
  accessToken: string;
}

export interface ValidateTokenResponse {
  isValid: boolean;
  userId: string;
}
