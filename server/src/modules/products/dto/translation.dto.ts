import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTranslationDto {
  @ApiProperty({ example: 'zh-CN', description: 'Locale code' })
  @IsString()
  locale!: string;

  @ApiProperty({ example: '48V 50Ah 锂电池组' })
  @IsString()
  @MaxLength(500)
  name!: string;

  @ApiPropertyOptional({ example: '高能量密度锂电池组，适用于工业应用' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  shortDescription?: string;

  @ApiPropertyOptional({ description: 'Full description in target language' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Features list' })
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiPropertyOptional({ description: 'Technical notes' })
  @IsOptional()
  @IsString()
  technicalNotes?: string;

  @ApiPropertyOptional({ example: '48V 50Ah 锂电池组 SEO标题' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ example: '高能量密度48V 50Ah锂电池组，适用于工业应用' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;
}

export class UpdateTranslationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  shortDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  technicalNotes?: string;

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
}
