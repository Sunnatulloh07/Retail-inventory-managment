import { getServiceClientConfig } from '@app/grpc';
import { SERVICE_PORTS } from '@app/shared';
import { UserServiceClient } from '@app/shared';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';

@Controller('user')
export class UserClientController {
  @Client(getServiceClientConfig('user', SERVICE_PORTS.USER as number))
  private client: ClientGrpc;

  private userService: UserServiceClient;

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  @Get('')
  getUserByPhone(@Param('phoneNumber') phoneNumber: string) {
    return this.userService.FindByPhone({ phoneNumber });
  }
}
