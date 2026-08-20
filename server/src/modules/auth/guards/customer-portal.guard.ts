import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

/**
 * Guard for Customer Portal endpoints
 * Only allows USER role to access customer portal
 * Blocks ANALYST and ADMIN roles
 */
@Injectable()
export class CustomerPortalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Only USER role can access customer portal
    if (user.role !== UserRole.USER) {
      throw new ForbiddenException('Customer portal access only');
    }

    return true;
  }
}
