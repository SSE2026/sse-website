import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateImageDto {
  @ApiProperty({ example: 'https://example.com/images/battery-1.jpg' })
  @IsString()
  @IsUrl()
  url!: string;

  @ApiPropertyOptional({ example: '48V Lithium Battery Pack Front View' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  alt?: string;

  @ApiPropertyOptional({ example: '48V Lithium Battery Pack Front View' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altEn?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}

export class UpdateImageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  alt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}
