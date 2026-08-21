import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { BannerService } from '../services/banner.service';
import { CreateBannerDto, UpdateBannerDto, ReorderBannersDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Banners')
@Controller()
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // ==================== Public API ====================

  @Get('banners')
  @ApiOperation({ summary: 'List active banners (public)' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of active banners sorted by sortOrder',
  })
  async findAllPublic() {
    return this.bannerService.findAllPublic();
  }

  @Get('banners/:id')
  @ApiOperation({ summary: 'Get banner by ID (public)' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns banner details',
  })
  @ApiResponse({
    status: 404,
    description: 'Banner not found',
  })
  async findOnePublic(@Param('id') id: string) {
    return this.bannerService.findOnePublic(id);
  }

  // ==================== Admin API ====================

  @Get('admin/banners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all banners (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all banners',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  async findAllAdmin() {
    return this.bannerService.findAllAdmin();
  }

  @Get('admin/banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get banner by ID (admin)' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns banner details',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @ApiResponse({
    status: 404,
    description: 'Banner not found',
  })
  async findOneAdmin(@Param('id') id: string) {
    return this.bannerService.findOneAdmin(id);
  }

  @Post('admin/banners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create banner (admin)' })
  @ApiResponse({
    status: 201,
    description: 'Banner created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  async create(@Body() dto: CreateBannerDto) {
    return this.bannerService.create(dto);
  }

  @Patch('admin/banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update banner (admin)' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: 200,
    description: 'Banner updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @ApiResponse({
    status: 404,
    description: 'Banner not found',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBannerDto,
  ) {
    return this.bannerService.update(id, dto);
  }

  @Post('admin/banners/:id/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete banner (admin)' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: 200,
    description: 'Banner deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @ApiResponse({
    status: 404,
    description: 'Banner not found',
  })
  async delete(@Param('id') id: string) {
    return this.bannerService.delete(id);
  }

  @Patch('admin/banners/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle banner status (admin)' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: 200,
    description: 'Banner status toggled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @ApiResponse({
    status: 404,
    description: 'Banner not found',
  })
  async toggleStatus(@Param('id') id: string) {
    return this.bannerService.toggleStatus(id);
  }

  @Post('admin/banners/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reorder banners (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Banners reordered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  async reorder(@Body() dto: ReorderBannersDto) {
    return this.bannerService.reorder(dto.ids);
  }
}
