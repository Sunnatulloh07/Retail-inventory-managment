import { User } from '@app/shared/schemas/user.schema';

export interface FindByPhoneRequest {
  phoneNumber: string;
}
export interface FindByPhoneResponse {
  user: User;
}

export interface FindByEmailRequest {
  email: string;
}
export interface FindByEmailResponse {
  user: User;
}

export interface UpdatePasswordRequest {
  userId: string;
  newPasswordHash: string;
}
export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

export interface GetByRoleRequest {
  role: string;
}
export interface GetByRoleResponse {
  user: User;
}
