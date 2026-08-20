import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DocumentService } from '../services/document.service';
import { DocumentDownloadService } from '../services/document-download.service';
import { QueryDocumentDto, buildPublicDocumentWhere } from '../dto/document-filter.dto';
import { DownloadDocumentDto } from '../dto/download-document.dto';
import { DocumentStatus } from '@prisma/client';

/**
 * Public Documents Controller
 * Only exposes PUBLISHED documents
 */
@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(
    private readonly documentService: DocumentService,
    private readonly downloadService: DocumentDownloadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List public documents' })
  @ApiQuery({ name: 'type', required: false, enum: ['DATASHEET', 'MSDS', 'UN383', 'CE', 'ROHS', 'UL', 'TEST_REPORT', 'USER_MANUAL', 'APPLICATION_NOTE', 'BROCHURE', 'WHITE_PAPER', 'OTHER'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'productId', required: false, type: String })
  @ApiQuery({ name: 'applicationId', required: false, type: String })
  @ApiQuery({ name: 'language', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns paginated list of published documents' })
  async findAll(@Query() query: QueryDocumentDto) {
    // Public API only shows PUBLISHED documents (status = PUBLISHED)
    const where = buildPublicDocumentWhere(query);
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const prismaService = (this.documentService as any).prisma;

    const [items, total] = await Promise.all([
      prismaService.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' },
        select: {
          id: true, name: true, nameEn: true, type: true,
          status: true, fileUrl: true, fileSize: true,
          language: true, leadRequired: true, downloadCount: true,
          published: true, publishedAt: true, createdAt: true,
        },
      }),
      prismaService.document.count({ where }),
    ]);

    return {
      success: true,
      items,
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details' })
  @ApiResponse({ status: 200, description: 'Returns document details' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findOne(@Param('id') id: string) {
    const document = await this.documentService.findById(id);

    // Only allow access to PUBLISHED documents
    if (document.status !== DocumentStatus.PUBLISHED) {
      throw new NotFoundException('Document not found');
    }

    return {
      success: true,
      data: document,
    };
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Download document with lead capture' })
  @ApiResponse({ status: 200, description: 'Returns download URL' })
  @ApiResponse({ status: 400, description: 'Email required or invalid' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async download(
    @Param('id') id: string,
    @Body() dto: DownloadDocumentDto,
  ) {
    const result = await this.downloadService.processDownload(id, dto);
    return {
      success: true,
      data: result,
    };
  }
}
