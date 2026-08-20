import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { CustomerPortalController } from './customer-portal.controller';
import { AdminPortalController } from './admin-portal.controller';
import { PublicInvitationController } from './public-invitation.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PrismaModule } from '../../prisma/prisma.module';
import { OwnershipService } from './services/ownership.service';
import { InvitationService } from './services/invitation.service';
import { AccountLinkingService } from './services/account-linking.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key-not-for-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    AuthController,
    CustomerPortalController,
    AdminPortalController,
    PublicInvitationController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    OwnershipService,
    InvitationService,
    AccountLinkingService,
  ],
  exports: [AuthService, OwnershipService, InvitationService, AccountLinkingService],
})
export class AuthModule {}
