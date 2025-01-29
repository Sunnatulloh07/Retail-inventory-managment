import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from '@app/shared/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '@app/shared/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { BcryptUtil } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('MONGODB_URI_USER') ||
          'mongodb://localhost:27017/userdb',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, BcryptUtil, ConfigService],
  exports: [UserService],
})
export class UserModule {}
