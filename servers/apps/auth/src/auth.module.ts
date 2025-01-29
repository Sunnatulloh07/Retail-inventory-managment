import { RedisModule } from '@app/common/utils/redis.util';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/shared/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { JWTGenerator } from '@app/common/utils/jwt.util';
import { BcryptUtil } from '@app/common';
import { OtpService } from './otp/otp.service';
import { SmsService } from './sms/sms.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'apps/user/src/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    OtpService,
    ConfigService,
    JWTGenerator,
    BcryptUtil,
    RedisModule,
    SmsService,
  ],
})
export class AuthModule {}
