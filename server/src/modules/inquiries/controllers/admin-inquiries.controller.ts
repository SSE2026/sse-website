import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InquiryService } from '../services/inquiry.service';
import {
  QueryInquiryDto,
  UpdateInquiryStatusDto,
  UpdateInquiryDto,
  AddActivityDto,
} from '../dto';
import { Roles, UserRole } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

/**
 * Admin Inquiries Controller
 * Handles CRM operations for inquiries
 */
@ApiTags('Admin - Inquiries')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin/inquiries')
export class AdminInquiriesController {
  private readonly logger = new Logger(AdminInquiriesController.name);

  constructor(private readonly inquiryService: InquiryService) {}

  @Get()
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  @ApiOperation({ summary: 'List all inquiries with filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of inquiries',
  })
  async findAll(@Query() query: QueryInquiryDto) {
    const result = await this.inquiryService.findAll(query);
    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get inquiry detail with activities' })
  @ApiResponse({
    status: 200,
    description: 'Returns inquiry with activities',
  })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  async findOne(@Param('id') id: string) {
    const inquiry = await this.inquiryService.findOne(id);
    return {
      success: true,
      data: inquiry,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update inquiry' })
  @ApiResponse({
    status: 200,
    description: 'Returns updated inquiry',
  })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInquiryDto,
  ) {
    const inquiry = await this.inquiryService.update(id, dto);
    return {
      success: true,
      data: inquiry,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update inquiry status' })
  @ApiResponse({
    status: 200,
    description: 'Returns updated inquiry',
  })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInquiryStatusDto,
    @CurrentUser() user: any,
  ) {
    this.logger.log(`User ${user.name} updating inquiry ${id} status to ${dto.status}`);

    const inquiry = await this.inquiryService.updateStatus(id, dto, user);
    return {
      success: true,
      data: inquiry,
    };
  }

  @Get(':id/activities')
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  @ApiOperation({ summary: 'List inquiry activities' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of activities',
  })
  async getActivities(@Param('id') id: string) {
    const result = await this.inquiryService.getActivities(id);
    return {
      success: true,
      data: result.items,
      meta: { total: result.total },
    };
  }

  @Post(':id/activities')
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add activity to inquiry' })
  @ApiResponse({
    status: 201,
    description: 'Returns created activity',
  })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  async addActivity(
    @Param('id') id: string,
    @Body() dto: AddActivityDto,
    @CurrentUser() user: any,
  ) {
    this.logger.log(`User ${user.name} adding ${dto.type} activity to inquiry ${id}`);

    const activity = await this.inquiryService.addActivity(id, dto, user);
    return {
      success: true,
      data: activity,
    };
  }
}
