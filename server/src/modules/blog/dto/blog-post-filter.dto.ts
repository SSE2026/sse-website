import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

/**
 * Query Blog Post DTO
 */
export class QueryBlogPostDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  locale?: string = 'en';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: 'title' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'publishedAt';

  @ApiPropertyOptional({ example: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

/**
 * Build Prisma where clause from QueryBlogPostDto
 */
export function buildBlogPostWhere(query: QueryBlogPostDto): Prisma.BlogPostWhereInput {
  const where: Prisma.BlogPostWhereInput = {
    deletedAt: null,
  };

  if (query.category) {
    where.category = {
      slug: query.category,
    };
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.tag) {
    where.tags = { has: query.tag };
  }

  if (query.featured !== undefined) {
    where.featured = query.featured;
  }

  if (query.search) {
    where.OR = [
      { slug: { contains: query.search, mode: 'insensitive' } },
      { translations: { some: { title: { contains: query.search, mode: 'insensitive' } } } },
    ];
  }

  return where;
}
