import {
  IsEnum,
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsArray,
  IsObject,
  IsInt,
  Min,
  Max,
  MaxLength,
  MinLength,
  IsEmpty,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InquiryType } from '@prisma/client';

/**
 * Create Inquiry DTO
 * Used for both public and authenticated submissions
 */
export class CreateInquiryDto {
  @ApiProperty({ enum: InquiryType, example: InquiryType.PRODUCT })
  @IsEnum(InquiryType, { message: 'Invalid inquiry type' })
  inquiryType!: InquiryType;

  // ===== Customer Information (Required) =====
  @ApiProperty({ example: 'john@abcrobotics.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @MinLength(1, { message: 'Customer name is required' })
  @MaxLength(100)
  customerName!: string;

  // ===== Company Information (Optional) =====
  @ApiPropertyOptional({ example: 'ABC Robotics' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @ApiPropertyOptional({ example: 'United States' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '+1-555-0123' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: '+1-555-0123' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  whatsapp?: string;

  @ApiPropertyOptional({ example: 'US' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  countryCode?: string;

  // ===== Product Information (PRODUCT type) =====
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productVariantId?: string;

  // ===== Technical Parameters (CUSTOM type) =====
  @ApiPropertyOptional({ example: '48V' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  voltage?: string;

  @ApiPropertyOptional({ example: '100Ah' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  capacity?: string;

  @ApiPropertyOptional({ example: '4800Wh' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  energy?: string;

  @ApiPropertyOptional({ example: '350 Wh/kg' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  energyDensity?: string;

  @ApiPropertyOptional({ example: '15kg' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  weight?: string;

  @ApiPropertyOptional({ example: '400x300x150mm' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  dimensions?: string;

  @ApiPropertyOptional({ example: '2C' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  chargeRate?: string;

  @ApiPropertyOptional({ example: '3C' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dischargeRate?: string;

  @ApiPropertyOptional({ example: '2000 cycles' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cycleLife?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  specifications?: Record<string, any>;

  // ===== Custom Requirement Snapshot (CUSTOM type) =====
  // Alternative to individual technical parameter fields
  @ApiPropertyOptional({ description: 'Complete requirement snapshot for CUSTOM inquiry type' })
  @IsOptional()
  @IsObject()
  requirementSnapshot?: {
    voltage?: number;
    capacity?: number;
    energy?: number;
    energyDensity?: number;
    chargeRate?: number;
    dischargeRate?: number;
    cycleLife?: number;
    application?: string;
  };

  // ===== Business Terms =====
  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  quantity?: number;

  @ApiPropertyOptional({ example: 'pcs' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  quantityUnit?: string;

  @ApiPropertyOptional({ example: 'USD 50/pcs' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  targetPrice?: string;

  @ApiPropertyOptional({ example: 'Q1 2027' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  expectedDelivery?: string;

  @ApiPropertyOptional({ example: 'Germany' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  destinationCountry?: string;

  // ===== Message =====
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  message?: string;

  // ===== Application =====
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  applicationId?: string;

  @ApiPropertyOptional({ example: 'AGV' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  applicationName?: string;

  // ===== Certifications & Special Requirements =====
  @ApiPropertyOptional({ example: ['UN38.3', 'IEC 62619'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({ example: 'IP67, -20°C to 60°C operating temperature' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  specialRequirements?: string;

  // ===== UTM Parameters (Auto-captured by frontend) =====
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  utmSource?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  utmMedium?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  utmCampaign?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  utmTerm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  utmContent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  landingPage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  referrer?: string;

  // ===== Honeypot (Hidden field - reject if filled) =====
  // Hidden field - not shown in API docs
  @IsOptional()
  @IsEmpty({ message: 'Spam detected' })
  website?: string;

  // ===== Idempotency Key (Interface预留 - 不修改数据库) =====
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsUUID()
  // idempotencyKey?: string;

  // ===== CAPTCHA Token (Interface预留 - 未来接入) =====
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // captchaToken?: string;
}
