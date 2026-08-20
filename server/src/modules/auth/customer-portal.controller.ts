import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CustomerPortalGuard } from './guards/customer-portal.guard';
import { OwnershipService } from './services/ownership.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from './strategies/jwt.strategy';

/**
 * Customer Portal API
 * All endpoints require authentication and USER role
 * Ownership is enforced through OwnershipService
 */
@Controller('me')
@UseGuards(JwtAuthGuard, CustomerPortalGuard)
export class CustomerPortalController {
  constructor(private readonly ownershipService: OwnershipService) {}

  /**
   * GET /me
   * Get current user's customer profile
   */
  @Get()
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.ownershipService.getCustomerProfile(user);
  }

  /**
   * GET /me/inquiries
   * Get all inquiries for the current user's customer
   */
  @Get('inquiries')
  async getInquiries(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.ownershipService.getCustomerInquiries(user, { page, limit, status });
  }

  /**
   * GET /me/inquiries/:id
   * Get a specific inquiry owned by the current user's customer
   */
  @Get('inquiries/:id')
  async getInquiry(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') inquiryId: string,
  ) {
    return this.ownershipService.getCustomerInquiry(user, inquiryId);
  }

  /**
   * GET /me/downloads
   * Get document download history for the current user's customer
   */
  @Get('downloads')
  async getDownloads(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ownershipService.getCustomerDownloads(user, { page, limit });
  }

  /**
   * GET /me/dashboard
   * Get dashboard stats for the current user's customer
   */
  @Get('dashboard')
  async getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.ownershipService.getCustomerDashboard(user);
  }
}
