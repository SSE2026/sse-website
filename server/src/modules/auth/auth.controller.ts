import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({
    status: 201,
    description: '注册成功，返回访问令牌',
  })
  @ApiResponse({
    status: 409,
    description: '邮箱已被注册',
  })
  @ApiResponse({
    status: 400,
    description: '请求参数无效',
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({
    status: 200,
    description: '登录成功，返回访问令牌',
  })
  @ApiResponse({
    status: 401,
    description: '用户名或密码错误',
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({
    status: 200,
    description: '返回当前登录用户信息',
  })
  @ApiResponse({
    status: 401,
    description: '未登录或令牌无效',
  })
  async getProfile(@CurrentUser() user: any) {
    return this.authService.validateUser(user.id);
  }

  @Post('bootstrap-admin')
  @ApiOperation({ summary: '创建管理员账户（仅在管理员不存在时创建）' })
  @ApiResponse({
    status: 201,
    description: '管理员创建成功',
  })
  @ApiResponse({
    status: 200,
    description: '管理员已存在',
  })
  async bootstrapAdmin(@Body() dto: { email?: string; password?: string }) {
    return this.authService.bootstrapAdmin(dto.email, dto.password);
  }
}
