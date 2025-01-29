import { SERVICE_PORTS } from '@app/shared';
import { getServiceClientConfig } from '@app/grpc';
import { ClientGrpc, ClientsModule } from '@nestjs/microservices';
import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AuthClientController } from './auth-service.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        ...getServiceClientConfig('auth', SERVICE_PORTS.AUTH),
      },
    ]),
  ],
  controllers: [AuthClientController],
})
export class AuthClientModule implements OnApplicationBootstrap {
  constructor(@Inject('AUTH_CLIENT') private readonly client: ClientGrpc) {}

  async onApplicationBootstrap() {
    try {
      const authService = this.client.getService<any>('AuthService');
      const health = await authService.healthCheck({});
      console.log('✅ Successfully connected to AuthService gRPC!', health);
    } catch (err) {
      console.error('❌ Failed to connect to AuthService gRPC:', err.message);
    }
  }
}
