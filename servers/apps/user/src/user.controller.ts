import { Body, Controller, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  FindByPhoneRequest,
  FindByPhoneResponse,
  GetByRoleRequest,
  GetByRoleResponse,
} from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { BcryptUtil } from '@app/common';

@Controller()
export class UserController implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const superAdminExist = await this.userService.getByRole(
      this.configService.get('SUPER_ADMIN_ROLE'),
    );
    if (superAdminExist) {
      console.log('Super admin already exists.');
      return;
    }
    const req = {
      phoneNumber: this.configService.get('SUPER_ADMIN_PHONE'),
      email: this.configService.get('SUPER_ADMIN_EMAIL'),
      password: await BcryptUtil.hashPassword(
        this.configService.get('SUPER_ADMIN_PASSWORD'),
      ),
      role: this.configService.get('SUPER_ADMIN_ROLE'),
    };
    await this.userService.createUser(req as any);
    console.log('Super admin created.');
  }

  @GrpcMethod('UserService', 'GetByRole')
  async getByRole(@Body() body: GetByRoleRequest): Promise<GetByRoleResponse> {
    const user = await this.userService.getByRole(body.role);
    return { user };
  }

  @GrpcMethod('UserService', 'FindByPhone')
  async findByPhone(
    @Body() body: FindByPhoneRequest,
  ): Promise<FindByPhoneResponse> {
    const user = await this.userService.getUserByPhoneNumber(body.phoneNumber);
    return { user };
  }

  @GrpcMethod('UserService', 'HealthCheck')
  healthCheck(): { status: string } {
    return { status: 'healthy' };
  }
}
