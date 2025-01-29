import { Observable } from 'rxjs';
import { FindByEmailRequest } from '..';

import { FindByEmailResponse } from '..';

import { FindByPhoneResponse } from '..';

import {
  FindByPhoneRequest,
  GetByRoleRequest,
  GetByRoleResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
} from './user.interface';

// UserServiceClient interfeysi
export interface UserServiceClient {
  FindByPhone(req: FindByPhoneRequest): Observable<FindByPhoneResponse>;
  FindByEmail(req: FindByEmailRequest): Observable<FindByEmailResponse>;
  UpdatePassword(
    req: UpdatePasswordRequest,
  ): Observable<UpdatePasswordResponse>;
  GetByRole(req: GetByRoleRequest): Observable<GetByRoleResponse>;
  // ... createUser, blockUser va h.k. bo'lishi mumkin
}
