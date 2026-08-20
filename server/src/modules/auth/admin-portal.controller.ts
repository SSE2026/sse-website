import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InvitationService } from './services/invitation.service';
import { AccountLinkingService } from './services/account-linking.service';
import { UserRole } from '@prisma/client';

/**
 * Admin Portal Management Controller
 * Handles portal account linking operations
 * All endpoints require ADMIN role
 */
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPortalController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly accountLinkingService: AccountLinkingService,
  ) {}

  /**
   * GET /admin/customers/:customerId/portal
   * Get customer portal status
   */
  @Get('customers/:customerId/portal')
  async getCustomerPortalStatus(@Param('customerId') customerId: string) {
    return this.accountLinkingService.getCustomerPortalStatus(customerId);
  }

  /**
   * GET /admin/customers/:customerId/portal/invitations
   * Get all invitations for a customer
   */
  @Get('customers/:customerId/portal/invitations')
  async getCustomerInvitations(@Param('customerId') customerId: string) {
    return this.invitationService.getCustomerInvitations(customerId);
  }

  /**
   * POST /admin/customers/:customerId/portal/invite
   * Create a new portal invitation
   */
  @Post('customers/:customerId/portal/invite')
  @HttpCode(HttpStatus.CREATED)
  async createInvitation(
    @Param('customerId') customerId: string,
    @Body() body: { email: string; name?: string; sendEmail?: boolean },
    @CurrentUser() user: any,
  ) {
    return this.invitationService.createInvitation({
      email: body.email,
      customerId,
      invitedById: user.id,
      invitedByName: user.name || 'Admin',
      sendEmail: body.sendEmail !== false,
    });
  }

  /**
   * GET /admin/users/:userId/portal
   * Get user portal details
   */
  @Get('users/:userId/portal')
  async getUserPortalDetails(@Param('userId') userId: string) {
    return this.accountLinkingService.getUserPortalDetails(userId);
  }

  /**
   * POST /admin/users/:userId/portal/link
   * Link an existing user to a customer
   */
  @Post('users/:userId/portal/link')
  @HttpCode(HttpStatus.OK)
  async linkUser(
    @Param('userId') userId: string,
    @Body() body: { customerId: string },
    @CurrentUser() user: any,
  ) {
    return this.accountLinkingService.linkUserToCustomer(
      userId,
      body.customerId,
      user.id,
      user.name || 'Admin',
    );
  }

  /**
   * DELETE /admin/users/:userId/portal/unlink
   * Unlink a user from their customer
   */
  @Delete('users/:userId/portal/unlink')
  @HttpCode(HttpStatus.OK)
  async unlinkUser(
    @Param('userId') userId: string,
    @Body() body: { reason: string },
    @CurrentUser() user: any,
  ) {
    return this.accountLinkingService.unlinkUserFromCustomer(
      userId,
      body.reason || 'Unlinked by admin',
      user.id,
      user.name || 'Admin',
    );
  }

  /**
   * PATCH /admin/users/:userId/portal/disable
   * Disable a portal user
   */
  @Patch('users/:userId/portal/disable')
  @HttpCode(HttpStatus.OK)
  async disableUser(
    @Param('userId') userId: string,
    @Body() body: { reason: string },
    @CurrentUser() user: any,
  ) {
    return this.accountLinkingService.disableUser(
      userId,
      body.reason || 'Disabled by admin',
      user.id,
      user.name || 'Admin',
    );
  }

  /**
   * PATCH /admin/users/:userId/portal/enable
   * Enable a disabled portal user
   */
  @Patch('users/:userId/portal/enable')
  @HttpCode(HttpStatus.OK)
  async enableUser(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    return this.accountLinkingService.enableUser(
      userId,
      user.id,
      user.name || 'Admin',
    );
  }

  /**
   * POST /admin/invitations/:invitationId/resend
   * Resend an invitation
   */
  @Post('invitations/:invitationId/resend')
  @HttpCode(HttpStatus.OK)
  async resendInvitation(
    @Param('invitationId') invitationId: string,
    @CurrentUser() user: any,
  ) {
    return this.invitationService.resendInvitation(
      invitationId,
      user.id,
      user.name || 'Admin',
    );
  }

  /**
   * POST /admin/invitations/:invitationId/revoke
   * Revoke an invitation
   */
  @Post('invitations/:invitationId/revoke')
  @HttpCode(HttpStatus.OK)
  async revokeInvitation(
    @Param('invitationId') invitationId: string,
    @Body() body: { reason: string },
    @CurrentUser() user: any,
  ) {
    return this.invitationService.revokeInvitation(
      invitationId,
      body.reason || 'Revoked by admin',
      user.id,
      user.name || 'Admin',
    );
  }
}
