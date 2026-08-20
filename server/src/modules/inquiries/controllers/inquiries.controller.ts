import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { InquiryService } from '../services/inquiry.service';
import { CreateInquiryDto } from '../dto/create-inquiry.dto';
import { Inquiry } from '@prisma/client';

/**
 * Public Inquiries Controller
 * Handles anonymous RFQ submission
 *
 * Rate limiting: 10 requests per minute per IP (configured in app.module.ts)
 */
@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  private readonly logger = new Logger(InquiriesController.name);

  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @UseInterceptors(
    FilesInterceptor('attachments', 10, {
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB per file
      },
    }),
  )
  @ApiOperation({ summary: 'Submit a new RFQ inquiry (Rate limit: 10/min)' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiResponse({
    status: 201,
    description: 'Inquiry created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/Inquiry' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async create(
    @Body() dto: CreateInquiryDto,
    @UploadedFiles() files?: any[],
  ): Promise<{ success: boolean; data: Inquiry }> {
    this.logger.log(`New inquiry submission from ${dto.email}`);

    const inquiry = await this.inquiryService.create(dto, files);

    return {
      success: true,
      data: inquiry,
    };
  }
}
