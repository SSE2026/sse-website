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
  ApiQuery,
} from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto, QueryCategoryDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Categories')
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ==================== Public API ====================

  @Get('categories')
  @ApiOperation({ summary: 'List all categories (public)' })
  @ApiQuery({ name: 'includeCounts', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Returns category tree',
  })
  async findAllPublic(@Query('includeCounts') includeCounts?: string) {
    return this.categoryService.findAllPublic(includeCounts === 'true');
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Get category by slug (public)' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiResponse({
    status: 200,
    description: 'Returns category with children',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async findOnePublic(@Param('slug') slug: string) {
    return this.categoryService.findOnePublic(slug);
  }

  // ==================== Admin API ====================

  @Get('admin/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all categories (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  async findAllAdmin(@Query() query: QueryCategoryDto) {
    return this.categoryService.findAllAdmin(query);
  }

  @Get('admin/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get category by ID (admin)' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns category details',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async findOneAdmin(@Param('id') id: string) {
    return this.categoryService.findOneAdmin(id);
  }

  @Post('admin/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category (admin)' })
  @ApiResponse({
    status: 201,
    description: 'Category created',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Duplicate slug',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch('admin/categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (admin)' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Post('admin/categories/:id/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category (admin)' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete - has products or children',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
