import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  role: string;
  customerId?: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-key-not-for-production',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser | null> {
    if (!payload.sub || !payload.role) {
      return null;
    }

    // Fetch user with customerId for ownership chain
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, customerId: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      role: user.role,
      customerId: user.customerId,
    };
  }
}
