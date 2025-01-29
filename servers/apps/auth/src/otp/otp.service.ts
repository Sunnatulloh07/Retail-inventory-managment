import { RedisModule } from '@app/common/utils/redis.util';
import { Injectable, Logger } from '@nestjs/common';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class OtpService {
  private logger = new Logger(OtpService.name);

  constructor(
    private readonly redisClient: RedisModule,
    private readonly smsService: SmsService,
  ) {}

  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async storeOtp(
    phoneNumber: string,
    code: string,
    ttlSeconds = 60 * 5,
  ): Promise<void> {
    await RedisModule.storeOtp(phoneNumber, code, ttlSeconds); // 5 minutes
  }

  async getStoredOtp(phoneNumber: string): Promise<string | null> {
    return await RedisModule.getOtp(phoneNumber);
  }

  async removeOtp(phoneNumber: string): Promise<void> {
    await RedisModule.deleteOtp(phoneNumber);
  }

  async sendOtpSms(phoneNumber: string, code: string): Promise<void> {
    this.logger.log(`OTP code ${code} sent to phone ${phoneNumber}`);
    await this.smsService.sendSms(phoneNumber, code);
    return;
  }
}
