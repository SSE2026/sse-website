import { SetMetadata } from '@nestjs/common';
import { UserRole as PrismaUserRole } from '@prisma/client';

export { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: PrismaUserRole[]) => SetMetadata(ROLES_KEY, roles);
