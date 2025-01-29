import { createService } from '@app/grpc';
import { SERVICE_PORTS } from '@app/shared';
import { UserModule } from './user.module';
import { GrpcExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await createService('user', UserModule, SERVICE_PORTS.USER);
  app.useGlobalFilters(new GrpcExceptionFilter());
  await app.listen();
  console.log('User service is running on port', SERVICE_PORTS.USER);
}
bootstrap();
