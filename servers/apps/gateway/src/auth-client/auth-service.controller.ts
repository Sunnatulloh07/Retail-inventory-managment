import {
  LoginByPhoneRequest,
  LoginByPhoneResponse,
  SERVICE_PORTS,
  ValidateTokenRequest,
  ValidateTokenResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@app/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { getServiceClientConfig } from '@app/grpc';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient } from '@app/shared';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthClientController {
  @Client(getServiceClientConfig('auth', SERVICE_PORTS.AUTH as number))
  private readonly client: ClientGrpc;

  private authService: AuthServiceClient;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  @Post('login-by-phone')
  loginByPhone(
    @Body() dto: LoginByPhoneRequest,
  ): Observable<LoginByPhoneResponse> {
    return this.authService.LoginByPhone(dto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() data: VerifyOtpRequest): Observable<VerifyOtpResponse> {
    return this.authService.VerifyOtp(data);
  }

  @Post('validate-token')
  validateToken(
    @Body() data: ValidateTokenRequest,
  ): Observable<ValidateTokenResponse> {
    return this.authService.ValidateToken(data);
  }
}
