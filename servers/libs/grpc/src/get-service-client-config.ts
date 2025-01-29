import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export function getServiceClientConfig(
  name: string,
  port: number,
): ClientOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: name,
      protoPath: join(__dirname, '../../../proto', `${name}.proto`),
      url:
        process.env.NODE_ENV === 'production'
          ? `${name}:${port}`
          : `localhost:${port}`,
    },
  };
}
