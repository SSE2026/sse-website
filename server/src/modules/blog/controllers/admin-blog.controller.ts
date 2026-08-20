import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from '../services/blog.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  QueryBlogPostDto,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from '../dto';
import { Roles, UserRole } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

/**
 * Admin Blog Controller
 */
@ApiTags('Admin - Blog')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin/blog')
export class AdminBlogController {
  private readonly logger = new Logger(AdminBlogController.name);

  constructor(private readonly blogService: BlogService) {}

  // ==================== Categories ====================

  @Get('categories')
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'List all blog categories (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns list of all categories' })
  async findCategories(@Query('locale') locale?: string) {
    const categories = await this.blogService.findAllCategories(locale);
    return {
      success: true,
      data: categories,
    };
  }

  @Post('categories')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create blog category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(@Body() dto: CreateBlogCategoryDto) {
    const category = await this.blogService.createCategory(dto);
    return {
      success: true,
      data: category,
    };
  }

  @Patch('categories/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update blog category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateBlogCategoryDto,
  ) {
    const category = await this.blogService.updateCategory(id, dto);
    return {
      success: true,
      data: category,
    };
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete blog category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async deleteCategory(@Param('id') id: string) {
    await this.blogService.deleteCategory(id);
    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }

  // ==================== Posts ====================

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'List all blog posts (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of all posts' })
  async findAll(@Query() query: QueryBlogPostDto) {
    const result = await this.blogService.findAll(query);
    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'Get blog post by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns blog post details' })
  async findOne(@Param('id') id: string) {
    const post = await this.blogService.findById(id);
    return {
      success: true,
      data: post,
    };
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create blog post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  async create(@Body() dto: CreateBlogPostDto) {
    const post = await this.blogService.create(dto);
    return {
      success: true,
      data: post,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update blog post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  async update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    const post = await this.blogService.update(id, dto);
    return {
      success: true,
      data: post,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Soft delete blog post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.blogService.delete(id);
    return {
      success: true,
      message: 'Post deleted successfully',
    };
  }
}
