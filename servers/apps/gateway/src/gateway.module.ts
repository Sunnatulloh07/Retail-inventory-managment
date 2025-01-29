import { Module } from '@nestjs/common';
import { UserClientModule } from './user-client/user-client.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@app/common';
import { AuthClientModule } from './auth-client/auth-client.module';

@Module({
  imports: [AuthClientModule, UserClientModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class GatewayModule {}
