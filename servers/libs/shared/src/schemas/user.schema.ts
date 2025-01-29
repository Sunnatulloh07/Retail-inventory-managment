import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ default: () => new Types.ObjectId(), required: false })
  _id: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: false, unique: true, sparse: true })
  email?: string;

  @Prop({ required: false })
  password?: string; // Parol hash

  @Prop({
    default: 'SALES',
    enum: ['SALES', 'ADMIN', 'MANAGER', 'SUPER_ADMIN', 'SUPER_MANAGER'],
  })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  // 2FA
  @Prop({ default: false })
  isTwoFactorEnabled: boolean;

  @Prop()
  twoFactorSecret?: string;

  @Prop({ default: false })
  isBlocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
