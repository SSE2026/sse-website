import {
  Controller,
  Get,
  Put,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ContentService } from '../services/content.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Content')
@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // ==================== Public ====================

  @Get('content/:page')
  @ApiOperation({ summary: 'Get page content (public)' })
  @ApiParam({ name: 'page', description: 'Page key: home/about/cases/contact/technology/products/news' })
  async getPublic(
    @Param('page') page: string,
    @Query('locale') locale: string = 'en',
  ) {
    return this.contentService.getPublic(page, locale);
  }

  // ==================== Admin ====================

  @Get('admin/content')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all pages (admin)' })
  async findAllAdmin() {
    return this.contentService.findAllAdmin();
  }

  @Get('admin/content/:page')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get page detail (admin)' })
  async findOneAdmin(@Param('page') page: string) {
    return this.contentService.findOneAdmin(page);
  }

  @Put('admin/content/:page/:locale')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upsert full page content (admin)' })
  async upsert(
    @Param('page') page: string,
    @Param('locale') locale: string,
    @Body() body: { content: Record<string, unknown>; published?: boolean },
  ) {
    return this.contentService.upsert(page, locale, body);
  }

  @Patch('admin/content/:page/:locale')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Patch page content sections (admin)' })
  async patchSection(
    @Param('page') page: string,
    @Param('locale') locale: string,
    @Body() body: { content: Record<string, unknown>; published?: boolean },
  ) {
    return this.contentService.patchSection(page, locale, body);
  }
}
