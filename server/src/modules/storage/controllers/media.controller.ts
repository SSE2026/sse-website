import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorageService } from '../services/cloudinary-storage.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * Generic media upload endpoint (ADMIN only).
 * Reuses CloudinaryStorageService — folder is controlled by the caller.
 * Use for product/SKU images, CMS page images, etc.
 */
@ApiTags('Media')
@Controller('admin/media')
export class MediaController {
  constructor(private readonly cloudinaryService: CloudinaryStorageService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', description: 'Cloudinary folder (products, cms, etc.)' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a media file to Cloudinary (admin)' })
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @UploadedFile() file: any,
    @Query('folder') folder: string = 'products',
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '') || 'products';
    const result = await this.cloudinaryService.upload(
      {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      },
      safeFolder,
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
}
