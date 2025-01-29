import { Observable } from 'rxjs';
import {
  LoginByPhoneRequest,
  LoginByPhoneResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from './auth.interface';

export interface AuthServiceClient {
  LoginByPhone(data: LoginByPhoneRequest): Observable<LoginByPhoneResponse>;
  VerifyOtp(data: VerifyOtpRequest): Observable<VerifyOtpResponse>;
  ValidateToken(data: ValidateTokenRequest): Observable<ValidateTokenResponse>;
}
