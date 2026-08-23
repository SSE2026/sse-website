import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MediaType } from '@prisma/client';

export class CreateBannerDto {
  @ApiPropertyOptional({ example: 'IMAGE', enum: MediaType })
  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @ApiPropertyOptional({ example: 'Breaking Energy Limits' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: '突破能量极限' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  titleZh?: string;

  @ApiPropertyOptional({ example: 'Next-generation solid-state battery solutions' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitle?: string;

  @ApiPropertyOptional({ example: '下一代固态电池解决方案' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitleZh?: string;

  @ApiPropertyOptional({ example: '/images/banner.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;

  @ApiPropertyOptional({ example: '/images/banner-mobile.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  mobileImage?: string;

  @ApiPropertyOptional({ example: '/videos/banner.mp4' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  videoUrl?: string;

  @ApiPropertyOptional({ example: '/images/banner-poster.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  posterUrl?: string;

  @ApiPropertyOptional({ example: '/videos/banner-mobile.mp4' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  mobileVideoUrl?: string;

  @ApiPropertyOptional({ example: '/contact' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  link?: string;

  @ApiPropertyOptional({ example: 'Customize Now' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ctaText?: string;

  @ApiPropertyOptional({ example: '即刻定制' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ctaTextZh?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9999)
  sortOrder?: number;
}

export class UpdateBannerDto {
  @ApiPropertyOptional({ enum: MediaType })
  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  titleZh?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitleZh?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  mobileImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  posterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  mobileVideoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  link?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ctaText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ctaTextZh?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9999)
  sortOrder?: number;
}

export class ReorderBannersDto {
  @ApiProperty({ type: [String], description: 'Array of banner IDs in new order' })
  @IsString({ each: true })
  ids!: string[];
}
