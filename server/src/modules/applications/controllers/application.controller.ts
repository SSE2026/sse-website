import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ApplicationService } from '../services/application.service';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
  QueryApplicationDto,
  LinkProductDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Applications')
@Controller()
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  // ==================== Public API ====================

  @Get('applications')
  @ApiOperation({ summary: 'List all applications (public)' })
  @ApiResponse({ status: 200, description: 'Returns list of published applications' })
  async findAllPublic() {
    return this.applicationService.findAllPublic();
  }

  @Get('applications/:slug')
  @ApiOperation({ summary: 'Get application by slug (public)' })
  @ApiParam({ name: 'slug', description: 'Application slug' })
  @ApiResponse({ status: 200, description: 'Returns application with products' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async findOnePublic(@Param('slug') slug: string) {
    return this.applicationService.findOnePublic(slug);
  }

  // ==================== Admin API ====================

  @Get('admin/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all applications (admin)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list' })
  async findAllAdmin(@Query() query: QueryApplicationDto) {
    return this.applicationService.findAllAdmin(query);
  }

  @Get('admin/applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application by ID (admin)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 200, description: 'Returns application details' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async findOneAdmin(@Param('id') id: string) {
    return this.applicationService.findOneAdmin(id);
  }

  @Post('admin/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create application (admin)' })
  @ApiResponse({ status: 201, description: 'Application created' })
  @ApiResponse({ status: 409, description: 'Duplicate slug' })
  async create(@Body() dto: CreateApplicationDto) {
    return this.applicationService.create(dto);
  }

  @Patch('admin/applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application (admin)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 200, description: 'Application updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(id, dto);
  }

  @Post('admin/applications/:id/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete application (admin)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 200, description: 'Application deleted' })
  async delete(@Param('id') id: string) {
    return this.applicationService.delete(id);
  }

  // ==================== Product-Application Relation ====================

  @Post('admin/applications/:id/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Link product to application (admin)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: 201, description: 'Product linked' })
  @ApiResponse({ status: 409, description: 'Already linked' })
  async linkProduct(
    @Param('id') id: string,
    @Body() dto: LinkProductDto,
  ) {
    return this.applicationService.linkProduct(id, dto);
  }

  @Post('admin/applications/:id/products/:productId/unlink')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlink product from application (admin)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product unlinked' })
  async unlinkProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.applicationService.unlinkProduct(id, productId);
  }
}
