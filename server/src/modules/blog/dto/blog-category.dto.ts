import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Create Blog Category DTO
 */
export class CreateBlogCategoryDto {
  @ApiProperty({ example: 'technology' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  slug!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  // Primary translation (English)
  @ApiProperty({ example: 'Technology' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ example: 'Technology news and updates' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  // Chinese translation
  @ApiPropertyOptional({ example: '技术' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameZh?: string;

  @ApiPropertyOptional({ example: '技术和更新新闻' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descriptionZh?: string;
}

/**
 * Update Blog Category DTO
 */
export class UpdateBlogCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  // Translations
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  // Chinese translation
  @ApiPropertyOptional({ example: '技术' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameZh?: string;

  @ApiPropertyOptional({ example: '技术和更新新闻' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descriptionZh?: string;
}
