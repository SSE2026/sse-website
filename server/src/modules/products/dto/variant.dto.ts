import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @ApiProperty({ example: 'SKU-BATT-001-48V50AH' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  sku!: string;

  @ApiProperty({ example: '48V 50Ah Configuration' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ example: '48V 50Ah Config' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameEn?: string;

  // Override specs
  @ApiPropertyOptional({ example: 48 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nominalVoltage?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nominalCapacity?: number;

  @ApiPropertyOptional({ example: 2400 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  energy?: number;

  @ApiPropertyOptional({ example: 250 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  energyDensity?: number;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  length?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ example: 9.6 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: 299.99 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceUsd?: number;

  @ApiPropertyOptional({ example: 249.99 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceUsdMin?: number;

  @ApiPropertyOptional({ example: 349.99 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceUsdMax?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}

export class UpdateVariantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nominalVoltage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nominalCapacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  energy?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  energyDensity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  length?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  width?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  height?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceUsd?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceUsdMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceUsdMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}
