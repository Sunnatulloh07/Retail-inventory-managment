import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProductClientController } from './product-client.controller';
import { getServiceClientConfig } from '@app/grpc';
import { SERVICE_PORTS } from '@app/shared/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_CLIENT',
        ...getServiceClientConfig('product', SERVICE_PORTS.PRODUCT),
      },
    ]),
  ],
  controllers: [ProductClientController],
  providers: [],
})
export class ProductClientModule {}
