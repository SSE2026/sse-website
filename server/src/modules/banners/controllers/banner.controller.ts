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
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BannerService } from '../services/banner.service';
import { CreateBannerDto, UpdateBannerDto, ReorderBannersDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CloudinaryStorageService } from '../../storage/services/cloudinary-storage.service';
import type { Multer } from 'multer';

@ApiTags('Banners')
@Controller()
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly cloudinaryService: CloudinaryStorageService,
  ) {}

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

  // ==================== File Upload API ====================

  /**
   * Upload a banner media file (image or video) to Cloudinary
   * For large files (>4.5MB), use /admin/banners/upload/signature endpoint first
   */
  @Post('admin/banners/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image (JPG, PNG, WebP) or Video (MP4, WebM)',
        },
        type: {
          type: 'string',
          enum: ['image', 'video'],
          description: 'File type for validation',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload banner media file (admin)' })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or size',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new Error('No file provided');
    }

    const result = await this.cloudinaryService.upload(
      {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      },
      'banners'
    );

    return {
      success: true,
      url: result.url,
      path: result.path,
      originalName: result.originalName,
      mimeType: result.mimeType,
      size: result.size,
    };
  }

  /**
   * Get upload signature for direct browser-to-Cloudinary uploads
   * Use this for large files (>4.5MB) to bypass Vercel body limit
   */
  @Get('admin/banners/upload/signature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Cloudinary upload signature (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Returns signature for direct Cloudinary upload',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  async getUploadSignature(@Query('type') type: 'image' | 'video' = 'image') {
    const folder = type === 'video' ? 'banners/videos' : 'banners/images';
    const signature = this.cloudinaryService.generateUploadSignature(folder);

    return {
      success: true,
      signature,
      // Cloudinary upload URL
      uploadUrl: `https://api.cloudinary.com/v1_1/${signature.cloudName}/${type === 'video' ? 'video' : 'image'}/upload`,
    };
  }

  /**
   * Confirm a direct Cloudinary upload
   * Call this after browser uploads directly to Cloudinary
   */
  @Post('admin/banners/upload/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm Cloudinary upload (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Upload confirmed',
  })
  async confirmUpload(@Body() body: { publicId: string; url: string }) {
    const exists = await this.cloudinaryService.exists(body.publicId);

    if (!exists) {
      throw new Error('File not found in Cloudinary');
    }

    return {
      success: true,
      publicId: body.publicId,
      url: body.url,
    };
  }
}
