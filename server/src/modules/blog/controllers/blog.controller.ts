import {
  Controller,
  Get,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BlogService } from '../services/blog.service';
import { QueryBlogPostDto } from '../dto/blog-post-filter.dto';

/**
 * Public Blog Controller
 */
@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  private readonly logger = new Logger(BlogController.name);

  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'List published blog posts' })
  @ApiQuery({ name: 'locale', required: false, type: String, example: 'en' })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns paginated list of published blog posts' })
  async findAll(
    @Query() query: QueryBlogPostDto,
    @Query('locale') locale?: string,
  ) {
    const result = await this.blogService.findAllPublished(query, locale);
    return {
      success: true,
      ...result,
    };
  }

  @Get('categories')
  @ApiOperation({ summary: 'List blog categories' })
  @ApiQuery({ name: 'locale', required: false, type: String, example: 'en' })
  @ApiResponse({ status: 200, description: 'Returns list of blog categories' })
  async findCategories(@Query('locale') locale?: string) {
    const categories = await this.blogService.findAllCategories(locale);
    return {
      success: true,
      data: categories,
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiQuery({ name: 'locale', required: false, type: String, example: 'en' })
  @ApiResponse({ status: 200, description: 'Returns blog post details' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async findOne(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    const post = await this.blogService.findBySlug(slug, locale);
    return {
      success: true,
      data: post,
    };
  }
}
