import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export enum SortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NOMINAL_CAPACITY = 'nominalCapacity',
  ENERGY_DENSITY = 'energyDensity',
  SORT_ORDER = 'sortOrder',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryProductDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 12, description: 'Items per page (max 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 12;

  @ApiPropertyOptional({ example: 'en', description: 'Locale for translations' })
  @IsOptional()
  @IsString()
  locale?: string = 'en';

  @ApiPropertyOptional({ example: 'battery', description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'battery-cells', description: 'Category slug filter' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Category ID filter' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Application slug filter' })
  @IsOptional()
  @IsString()
  application?: string;

  @ApiPropertyOptional({ example: true, description: 'Featured products only' })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Minimum energy density (Wh/kg)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minEnergyDensity?: number;

  @ApiPropertyOptional({ description: 'Maximum energy density (Wh/kg)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxEnergyDensity?: number;

  @ApiPropertyOptional({ description: 'Minimum capacity (Ah)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minCapacity?: number;

  @ApiPropertyOptional({ description: 'Maximum capacity (Ah)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxCapacity?: number;

  @ApiPropertyOptional({ enum: SortField, description: 'Sort field' })
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField = SortField.CREATED_AT;

  @ApiPropertyOptional({ enum: SortOrder, description: 'Sort direction' })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
