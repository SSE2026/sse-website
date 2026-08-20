import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @ApiProperty({ example: 'password123', description: '密码（至少6位）' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @ApiProperty({ example: 'John Doe', description: '用户姓名' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString()
  password!: string;
}
