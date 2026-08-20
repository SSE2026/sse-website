import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DocumentType, DocumentStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

/**
 * Query Document DTO
 */
export class QueryDocumentDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: DocumentType })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  applicationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({ enum: DocumentStatus })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional({ example: 'name' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ example: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

/**
 * Build Prisma where clause from QueryDocumentDto
 * Public API filters by status=PUBLISHED, admin API shows all non-deleted
 */
export function buildDocumentWhere(query: QueryDocumentDto): Prisma.DocumentWhereInput {
  const where: Prisma.DocumentWhereInput = {
    deletedAt: null,
  };

  if (query.type) {
    where.type = query.type;
  }

  if (query.published !== undefined) {
    where.published = query.published;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.language) {
    where.language = query.language;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { nameEn: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.productId) {
    where.products = {
      some: {
        productId: query.productId,
      },
    };
  }

  if (query.applicationId) {
    where.applications = {
      some: {
        applicationId: query.applicationId,
      },
    };
  }

  return where;
}

/**
 * Build Prisma where clause for PUBLIC API
 * Only returns PUBLISHED documents that are not deleted
 */
export function buildPublicDocumentWhere(query: QueryDocumentDto): Prisma.DocumentWhereInput {
  return {
    ...buildDocumentWhere(query),
    // Public API only shows PUBLISHED documents
    status: DocumentStatus.PUBLISHED,
    deletedAt: null,
  };
}
