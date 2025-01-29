import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  LoginByPhoneRequest,
  LoginByPhoneResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@app/shared';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'LoginByPhone')
  async loginByPhone(data: LoginByPhoneRequest): Promise<LoginByPhoneResponse> {
    // 1. OTP yuborish
    return await this.authService.sendOtpToPhone(data);
  }

  @GrpcMethod('AuthService', 'VerifyOtp')
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return await this.authService.verifyOtp(data);
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: { accessToken: string }) {
    const { isValid, userId } = await this.authService.validateToken(
      data.accessToken,
    );
    return {
      isValid,
      userId: userId || '',
    };
  }

  @GrpcMethod('AuthService', 'HealthCheck')
  healthCheck(): { status: string } {
    return { status: 'healthy' };
  }
}
