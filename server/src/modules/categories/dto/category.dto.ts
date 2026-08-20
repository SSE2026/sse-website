import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ example: 'battery-cells', description: 'URL-friendly slug' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  slug!: string;

  @ApiPropertyOptional({ example: 'https://example.com/category.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'battery' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Parent category ID for hierarchical structure' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ example: 'Premium Battery Cells SEO Title' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'High-quality battery cells for industrial applications' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiPropertyOptional({ example: '/categories/battery-cells' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  canonicalUrl?: string;

  @ApiPropertyOptional({ example: false, description: 'Prevent search engine indexing' })
  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;

  @ApiPropertyOptional({ example: 0, description: 'Sort order' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ example: true, description: 'Published status' })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'battery-cells-updated' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  canonicalUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class QueryCategoryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Include product counts' })
  @IsOptional()
  @IsBoolean()
  includeCounts?: boolean = false;
}
