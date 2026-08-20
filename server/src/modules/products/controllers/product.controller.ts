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
import { ProductService } from '../services/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  QueryProductDto,
  CreateVariantDto,
  UpdateVariantDto,
  CreateImageDto,
  UpdateImageDto,
  CreateTranslationDto,
  UpdateTranslationDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Products')
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ==================== Public API ====================

  @Get('products')
  @ApiOperation({ summary: 'List products (public)' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of published products',
  })
  async findAllPublic(@Query() query: QueryProductDto) {
    return this.productService.findAllPublic(query);
  }

  @Get('products/featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of featured products',
  })
  async findFeatured(@Query('locale') locale?: string) {
    return this.productService.findFeatured(locale || 'en');
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Get product by slug (public)' })
  @ApiParam({ name: 'slug', description: 'Product slug' })
  @ApiQuery({ name: 'locale', required: false, description: 'Locale for translations' })
  @ApiResponse({
    status: 200,
    description: 'Returns product details',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findOnePublic(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return this.productService.findOnePublic(slug, locale || 'en');
  }

  // ==================== Admin API ====================

  @Get('admin/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all products (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of all products',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  async findAllAdmin(@Query() query: QueryProductDto) {
    return this.productService.findAllAdmin(query);
  }

  @Get('admin/products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product by ID (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns product details',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findOneAdmin(@Param('id') id: string) {
    return this.productService.findOneAdmin(id);
  }

  @Post('admin/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product (admin)' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or category not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Duplicate slug/SKU/model',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch('admin/products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Duplicate slug/SKU',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Patch('admin/products/:id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore deleted product (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product restored successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Product is not deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async restore(@Param('id') id: string) {
    return this.productService.restore(id);
  }

  @Patch('admin/products/:id/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete product (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Product is already deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async softDelete(@Param('id') id: string) {
    return this.productService.softDelete(id);
  }

  // ==================== Variant API ====================

  @Post('admin/products/:id/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add variant to product (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 201, description: 'Variant created' })
  async createVariant(
    @Param('id') id: string,
    @Body() dto: CreateVariantDto,
  ) {
    return this.productService.createVariant(id, dto);
  }

  @Patch('admin/products/:id/variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update variant (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  async updateVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productService.updateVariant(id, variantId, dto);
  }

  @Post('admin/products/:id/variants/:variantId/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete variant (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  async deleteVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productService.deleteVariant(id, variantId);
  }

  // ==================== Image API ====================

  @Post('admin/products/:id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add image to product (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 201, description: 'Image created' })
  async createImage(
    @Param('id') id: string,
    @Body() dto: CreateImageDto,
  ) {
    return this.productService.createImage(id, dto);
  }

  @Patch('admin/products/:id/images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update image (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  async updateImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @Body() dto: UpdateImageDto,
  ) {
    return this.productService.updateImage(id, imageId, dto);
  }

  @Post('admin/products/:id/images/:imageId/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete image (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  async deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productService.deleteImage(id, imageId);
  }

  // ==================== Translation API ====================

  @Post('admin/products/:id/translations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add translation to product (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 201, description: 'Translation created' })
  async createTranslation(
    @Param('id') id: string,
    @Body() dto: CreateTranslationDto,
  ) {
    return this.productService.createTranslation(id, dto);
  }

  @Patch('admin/products/:id/translations/:locale')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update translation (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'locale', description: 'Locale code (e.g., zh-CN)' })
  async updateTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
    @Body() dto: UpdateTranslationDto,
  ) {
    return this.productService.updateTranslation(id, locale, dto);
  }

  @Post('admin/products/:id/translations/:locale/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete translation (admin)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'locale', description: 'Locale code' })
  async deleteTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
  ) {
    return this.productService.deleteTranslation(id, locale);
  }
}
