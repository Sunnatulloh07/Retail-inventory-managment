import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly apiUrl = 'https://notify.eskiz.uz/api';
  private token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async login(): Promise<void> {
    const loginData = {
      email: this.configService.get<string>('ESKIZ_EMAIL'),
      password: this.configService.get<string>('ESKIZ_PASSWORD'),
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.apiUrl}/auth/login`, loginData),
    );

    if (response.data.status === 'success') {
      this.token = response.data.data.token;
    } else {
      throw new Error('Eskiz login failed');
    }
  }

  async sendSms(phone: string, message: string): Promise<void> {
    if (!this.token) {
      await this.login();
    }

    const smsData = {
      mobile_phone: phone,
      message: message,
      from: this.configService.get<string>('ESKIZ_FROM'),
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.apiUrl}/message/sms/send`, smsData, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }),
    );

    if (response.data.status !== 'success') {
      throw new Error(`Failed to send SMS: ${response.data.message}`);
    }
  }
}
