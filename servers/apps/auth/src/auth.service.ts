import {
  LoginByPhoneRequest,
  LoginByPhoneResponse,
  ValidateTokenResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@app/shared';
import { Injectable } from '@nestjs/common';
import { OtpService } from './otp/otp.service';
import { JWTGenerator } from '@app/common/utils/jwt.util';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '@app/common';
import { SmsService } from './sms/sms.service';
import { RpcException } from '@nestjs/microservices';
import { UserService } from 'apps/user/src/user.service';

@Injectable()
export class AuthService {
  constructor(
    private otpService: OtpService,
    private jwtGenerator: JWTGenerator,
    private configService: ConfigService,
    private smsService: SmsService,
    private userService: UserService,
  ) {}
  // Telefon raqamga OTP yuborish (mock funksiyasi)
  async sendOtpToPhone(
    loginByPhoneRequest: LoginByPhoneRequest,
  ): Promise<LoginByPhoneResponse> {
    // Bu yerda real SMS gateway integratsiyasi bo'lishi mumkin
    const otpCode = this.otpService.generateOtpCode();
    await this.otpService.storeOtp(
      loginByPhoneRequest.phoneNumber,
      otpCode,
      this.configService.get('OTP_EXPIRATION_TIME'),
    );
    return {
      success: true,
      message: 'OTP sent to phone',
    };
  }

  // OTP send to phone number
  async verifyOtp(
    verifyOtpRequest: VerifyOtpRequest,
  ): Promise<VerifyOtpResponse> {
    if (await RedisModule.isBlocked(verifyOtpRequest.phoneNumber)) {
      throw new RpcException({
        code: 400,
        message: 'Too many failed attempts. Please try again later.',
      });
    }
    const storedOtp = await this.otpService.getStoredOtp(
      verifyOtpRequest.phoneNumber,
    );
    if (!storedOtp || storedOtp !== verifyOtpRequest.otpCode) {
      await RedisModule.recordFailure(verifyOtpRequest.phoneNumber);
      throw new RpcException({
        code: 400,
        message: 'Invalid OTP',
      });
    }
    const user = await this.userService.getUserByPhoneNumber(
      verifyOtpRequest.phoneNumber,
    );

    if (!user || !user.isActive) {
      throw new RpcException({
        code: 400,
        message: 'User not found or inactive',
      });
    }
    const accessToken = this.jwtGenerator.generateAccessToken(
      user._id.toString(),
    );
    const refreshToken = this.jwtGenerator.generateRefreshToken(
      user._id.toString(),
    );
    await this.otpService.removeOtp(verifyOtpRequest.phoneNumber);
    await RedisModule.removeFailureCount(verifyOtpRequest.phoneNumber);
    return {
      accessToken,
      refreshToken,
      success: true,
      message: 'OTP verified',
    };
  }

  // Token validation
  async validateToken(accessToken: string): Promise<ValidateTokenResponse> {
    try {
      const decoded = await this.jwtGenerator.validateAccessToken(accessToken);
      if (!decoded) {
        throw new RpcException({
          code: 400,
          message: 'Invalid token',
        });
      }
      return { isValid: true, userId: decoded.userId };
    } catch (error) {
      throw new RpcException({
        code: 400,
        message: 'Invalid token',
      });
    }
  }
}
