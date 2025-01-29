import { createService } from '@app/grpc';
import { SERVICE_PORTS } from '@app/shared';
import { ProductModule } from './product.module';
import { GrpcExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await createService(
    'product',
    ProductModule,
    SERVICE_PORTS.PRODUCT,
  );
  app.useGlobalFilters(new GrpcExceptionFilter());
  await app.listen();
  console.log('Product service is running on port', SERVICE_PORTS.PRODUCT);
}
bootstrap();
