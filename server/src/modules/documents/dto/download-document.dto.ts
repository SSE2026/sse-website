import {
  IsEmail,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Download Document (Lead Capture) DTO
 */
export class DownloadDocumentDto {
  @ApiProperty({ example: 'buyer@example.com', description: 'Email is required if document.leadRequired is true' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @ApiPropertyOptional({ example: 'John Buyer' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'ABC Aerospace' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  company?: string;

  @ApiPropertyOptional({ example: 'Germany' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: 'How soon can we get samples?' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
