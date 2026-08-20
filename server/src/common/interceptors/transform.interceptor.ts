import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If already wrapped, return as-is
        if (data?.success !== undefined) {
          return data;
        }

        // Check if it's a paginated response
        if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
          return {
            success: true as const,
            ...data,
          };
        }

        // Single item
        return {
          success: true as const,
          data,
        };
      }),
    );
  }
}
