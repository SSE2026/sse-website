import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { DocumentService } from '../services/document.service';
import { DocumentDownloadService } from '../services/document-download.service';
import { LocalStorageService } from '../../storage/services/local-storage.service';
import { FileValidationService } from '../../storage/services/file-validation.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { QueryDocumentDto } from '../dto/document-filter.dto';
import { Roles, UserRole } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

/**
 * Admin Documents Controller
 */
@ApiTags('Admin - Documents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin/documents')
export class AdminDocumentsController {
  private readonly logger = new Logger(AdminDocumentsController.name);
  private readonly fileValidation: FileValidationService;

  constructor(
    private readonly documentService: DocumentService,
    private readonly downloadService: DocumentDownloadService,
    private readonly storageService: LocalStorageService,
  ) {
    this.fileValidation = new FileValidationService();
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List all documents (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of all documents' })
  async findAll(@Query() query: QueryDocumentDto) {
    const result = await this.documentService.findAll(query);
    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get document by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns document details' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findOne(@Param('id') id: string) {
    const document = await this.documentService.findById(id);
    return {
      success: true,
      data: document,
    };
  }

  @Get(':id/downloads')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get download analytics for document' })
  @ApiResponse({ status: 200, description: 'Returns download statistics' })
  async getDownloads(@Param('id') id: string) {
    const analytics = await this.downloadService.getDownloadAnalytics(id);
    return {
      success: true,
      data: analytics,
    };
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreateDocumentDto) {
    const document = await this.documentService.create(dto);
    return {
      success: true,
      data: document,
    };
  }

  @Post(':id/upload')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file for document' })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async uploadFile(@Param('id') id: string, @UploadedFile() file: any) {
    if (!file) {
      return {
        success: false,
        error: { code: 'NO_FILE', message: 'No file uploaded' },
      };
    }

    // Validate file
    try {
      this.fileValidation.validate({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
    } catch (error) {
      return {
        success: false,
        error: { code: 'INVALID_FILE', message: error instanceof Error ? error.message : 'Invalid file' },
      };
    }

    // Upload to storage
    const uploaded = await this.storageService.upload(
      {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      },
      'documents',
    );

    // Update document with file info
    const result = await this.documentService.uploadFile(id, {
      filename: file.originalname,
      url: uploaded.url,
      size: file.size,
      mimeType: file.mimetype,
    });

    return {
      success: true,
      data: result,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    const document = await this.documentService.update(id, dto);
    return {
      success: true,
      data: document,
    };
  }

  @Post(':id/publish')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish document (READY -> PUBLISHED)' })
  @ApiResponse({ status: 200, description: 'Document published successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status or missing file' })
  async publish(@Param('id') id: string) {
    const result = await this.documentService.publish(id);
    return {
      success: true,
      data: result,
    };
  }

  @Post(':id/archive')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Archive document (PUBLISHED -> ARCHIVED)' })
  @ApiResponse({ status: 200, description: 'Document archived successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  async archive(@Param('id') id: string) {
    const result = await this.documentService.archive(id);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Soft delete document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async delete(@Param('id') id: string) {
    await this.documentService.delete(id);
    return {
      success: true,
      message: 'Document deleted successfully',
    };
  }
}
