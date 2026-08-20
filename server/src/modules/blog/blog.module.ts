import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BlogController, AdminBlogController } from './controllers';
import { BlogService } from './services/blog.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BlogController, AdminBlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
