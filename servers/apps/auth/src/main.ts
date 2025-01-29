import { createService } from '@app/grpc';
import { SERVICE_PORTS } from '@app/shared';
import { AuthModule } from './auth.module';
import { GrpcExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await createService(
    'auth',
    AuthModule,
    SERVICE_PORTS.AUTH as number,
  );
  app.useGlobalFilters(new GrpcExceptionFilter());
  await app.listen();
  console.log('Auth service is running on port', SERVICE_PORTS.AUTH);
}
bootstrap();
