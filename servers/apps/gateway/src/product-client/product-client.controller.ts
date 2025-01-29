import { Controller, Get, Param } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { getServiceClientConfig } from '@app/grpc';
import { SERVICE_PORTS } from '@app/shared';
import { ProductServiceClient } from '@app/shared';

@Controller('product')
export class ProductClientController {
  @Client(getServiceClientConfig('product', SERVICE_PORTS.PRODUCT))
  private readonly client: ClientGrpc;

  private productService: ProductServiceClient;

  onModuleInit() {
    this.productService =
      this.client.getService<ProductServiceClient>('ProductService');
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProduct({ id });
  }
}
