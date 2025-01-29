import { User } from '@app/shared/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userModel
      .findOne({ phoneNumber })
      .lean()
      .catch(() => null);
  }

  async getByRole(role: string): Promise<User> {
    return this.userModel
      .findOne({ role })
      .lean()
      .catch(() => null);
  }

  async createUser(user: {
    phoneNumber: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    return this.userModel.create(user);
  }
}
