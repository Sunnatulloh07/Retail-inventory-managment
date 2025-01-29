import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();

    // console.error('gRPC Exception:', error);
    return throwError(() => ({
      code: error['code'] || 500,
      message: error['message'] || 'Internal server error',
    }));
  }
}
