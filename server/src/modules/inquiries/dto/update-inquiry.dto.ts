import { IsEnum, IsOptional, IsString, IsUUID, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InquiryStatus } from '@prisma/client';

/**
 * Update Inquiry Status DTO
 */
export class UpdateInquiryStatusDto {
  @ApiProperty({ enum: InquiryStatus })
  @IsEnum(InquiryStatus, { message: 'Invalid inquiry status' })
  status!: InquiryStatus;

  @ApiPropertyOptional({ example: 'Customer confirmed order requirements' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

/**
 * Update Inquiry DTO (General update)
 */
export class UpdateInquiryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  customerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ enum: InquiryStatus })
  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  targetPrice?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  internalNotes?: string;
}
