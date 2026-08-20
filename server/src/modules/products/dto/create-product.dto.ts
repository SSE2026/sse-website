import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsUrl,
  IsObject,
  IsArray,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'SKU-BATT-001', description: 'Product SKU' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  sku!: string;

  @ApiProperty({ example: '48V 50Ah Lithium Battery Pack', description: 'Product model' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  model!: string;

  @ApiProperty({ example: '48v-50ah-lithium-battery-pack', description: 'URL-friendly slug' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug!: string;

  @ApiProperty({ example: 'uuid-of-category', description: 'Category ID' })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({ example: 'Swift Safe Energy' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({ example: 'Li-ion', description: 'Battery chemistry' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  chemistry?: string;

  @ApiPropertyOptional({ example: 'High energy density lithium battery for industrial applications' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiPropertyOptional({ description: 'Full product description' })
  @IsOptional()
  @IsString()
  description?: string;

  // Core Electrical Specs
  @ApiPropertyOptional({ example: 48, description: 'Nominal voltage (V)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nominalVoltage?: number;

  @ApiPropertyOptional({ example: 50, description: 'Nominal capacity (Ah)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nominalCapacity?: number;

  @ApiPropertyOptional({ example: 2400, description: 'Energy (Wh)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  energy?: number;

  @ApiPropertyOptional({ example: 250, description: 'Energy density (Wh/kg)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  energyDensity?: number;

  @ApiPropertyOptional({ example: 1, description: 'Charge rate (C)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  chargeRate?: number;

  @ApiPropertyOptional({ example: 3, description: 'Discharge rate (C)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  dischargeRate?: number;

  @ApiPropertyOptional({ example: 5, description: 'Peak discharge rate (C)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  peakDischargeRate?: number;

  // Core Mechanical Specs
  @ApiPropertyOptional({ example: 300, description: 'Length (mm)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  length?: number;

  @ApiPropertyOptional({ example: 150, description: 'Width (mm)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ example: 100, description: 'Height (mm)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ example: 9.6, description: 'Weight (kg)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  // Core Performance
  @ApiPropertyOptional({ example: 2000, description: 'Cycle life (cycles)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cycleLife?: number;

  @ApiPropertyOptional({ example: -20, description: 'Operating temp min (°C)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  operatingTempMin?: number;

  @ApiPropertyOptional({ example: 60, description: 'Operating temp max (°C)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  operatingTempMax?: number;

  // Business Terms
  @ApiPropertyOptional({ example: 10, description: 'Minimum order quantity' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  moq?: number;

  @ApiPropertyOptional({ example: true, description: 'Sample available' })
  @IsOptional()
  @IsBoolean()
  sampleAvailable?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Customization available' })
  @IsOptional()
  @IsBoolean()
  customizationAvailable?: boolean;

  @ApiPropertyOptional({ example: '2-4 weeks', description: 'Lead time' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  leadTime?: string;

  // JSON Fields
  @ApiPropertyOptional({ description: 'Extended specifications (JSON)' })
  @IsOptional()
  @IsObject()
  specifications?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Features list (JSON array)' })
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiPropertyOptional({ description: 'Applications list (JSON array)' })
  @IsOptional()
  @IsArray()
  applications?: string[];

  // SEO
  @ApiPropertyOptional({ example: '48V 50Ah Battery Pack | Swift Safe Energy' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'High performance 48V 50Ah lithium battery pack for industrial applications' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiPropertyOptional({ example: '/products/48v-50ah-battery' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  canonicalUrl?: string;

  @ApiPropertyOptional({ example: false, description: 'Prevent search engine indexing' })
  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;

  // Status
  @ApiPropertyOptional({ example: false, description: 'Published status' })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Featured status' })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: 0, description: 'Sort order' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}
