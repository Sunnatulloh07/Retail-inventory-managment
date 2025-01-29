import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { AllExceptionsFilter, GrpcExceptionFilter } from '@app/common';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new GrpcExceptionFilter());
  await app.listen(PORT);
  console.log(`Gateway is running on port ${PORT}`);
}
bootstrap();
