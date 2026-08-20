import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  IsInt,
  Min,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Create Blog Post DTO
 */
export class CreateBlogPostDto {
  @ApiProperty({ example: 'solid-state-battery-breakthrough' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug!: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @ApiPropertyOptional({ example: 'Admin' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  authorName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: ['technology', 'battery'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 'New Battery Breakthrough' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'An exciting new development...' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  excerpt?: string;

  @ApiProperty({ example: '<p>Full article content...</p>' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'SEO Title for Blog Post' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'SEO description for blog post...' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiPropertyOptional({ example: '/blog/solid-state-battery' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  canonicalUrl?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  // Translations
  @ApiPropertyOptional({ example: 'zh Title' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  titleZh?: string;

  @ApiPropertyOptional({ example: 'zh Excerpt' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  excerptZh?: string;

  @ApiPropertyOptional({ example: '<p>zh Content...</p>' })
  @IsOptional()
  @IsString()
  contentZh?: string;

  @ApiPropertyOptional({ example: 'zh SEO Title' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitleZh?: string;

  @ApiPropertyOptional({ example: 'zh SEO Description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescriptionZh?: string;
}
