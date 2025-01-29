import { ClientGrpc, ClientsModule } from '@nestjs/microservices';
import { getServiceClientConfig } from '@app/grpc';
import { Inject, OnApplicationBootstrap, Module } from '@nestjs/common';
import { SERVICE_PORTS } from '@app/shared/constants';
import { UserClientController } from './user-client.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptUtil } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...getServiceClientConfig('user', SERVICE_PORTS.USER),
      },
    ]),
  ],
  controllers: [UserClientController],
  providers: [UserClientController, ConfigService, BcryptUtil],
})
export class UserClientModule implements OnApplicationBootstrap {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientGrpc) {}

  async onApplicationBootstrap() {
    try {
      const userService = this.client.getService<any>('UserService');
      const health = await userService.healthCheck({});
      console.log('✅ Successfully connected to UserService gRPC!', health);
    } catch (err) {
      console.error('❌ Failed to connect to UserService gRPC:', err.message);
    }
  }
}
