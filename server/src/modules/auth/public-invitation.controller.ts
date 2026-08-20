import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InvitationService } from './services/invitation.service';

/**
 * Public Invitation Controller
 * Handles invitation acceptance without authentication
 */
@Controller('invitations')
export class PublicInvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  /**
   * GET /invitations/:token
   * Validate invitation token and get invitation details
   * Public endpoint - no auth required
   */
  @Get(':token')
  async validateInvitation(@Param('token') token: string) {
    return this.invitationService.getInvitationByToken(token);
  }

  /**
   * POST /invitations/:token/accept
   * Accept an invitation with password setup
   * Public endpoint - no auth required
   */
  @Post(':token/accept')
  @HttpCode(HttpStatus.OK)
  async acceptInvitation(
    @Param('token') token: string,
    @Body() body: { password: string; name?: string },
  ) {
    const result = await this.invitationService.acceptInvitation(token, {
      password: body.password,
      name: body.name,
    });

    // Return user info and token (not password)
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      accessToken: result.accessToken,
      tokenType: 'Bearer',
    };
  }
}
