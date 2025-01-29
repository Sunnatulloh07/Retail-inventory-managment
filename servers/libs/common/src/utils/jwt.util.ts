import { ValidateTokenResponse } from '@app/shared/interfaces/auth/auth.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class JWTGenerator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(userId: string) {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_SECRET_ACCESS_TOKEN'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  generateRefreshToken(userId: string) {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_SECRET_REFRESH_TOKEN'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  validateAccessToken(token: string): Promise<ValidateTokenResponse> {
    return this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET_ACCESS_TOKEN'),
    });
  }

  validateRefreshToken(token: string): Promise<ValidateTokenResponse> {
    return this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET_REFRESH_TOKEN'),
    });
  }
}
