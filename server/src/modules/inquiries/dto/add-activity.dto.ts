import { IsEnum, IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityType } from '@prisma/client';

/**
 * Add Activity DTO
 */
export class AddActivityDto {
  @ApiProperty({ enum: ActivityType, description: 'Activity type (excluding STATUS_CHANGE)' })
  @IsEnum(ActivityType, {
    message: 'Invalid activity type',
  })
  type!: Exclude<ActivityType, 'STATUS_CHANGE'>;

  @ApiProperty({ example: 'Called customer' })
  @IsString()
  @MinLength(1, { message: 'Title is required' })
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Discussed pricing and delivery timeline' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;
}
