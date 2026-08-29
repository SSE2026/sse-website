import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { ProductModule } from './modules/products/product.module';
import { CategoryModule } from './modules/categories/category.module';
import { ApplicationModule } from './modules/applications/application.module';
import { LoggerMiddleware } from './common/utils/logger.middleware';

// Phase 3.3 Modules
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { CustomerModule } from './modules/customers/customers.module';
import { CompanyModule } from './modules/companies/companies.module';
import { EmailModule } from './modules/email/email.module';
import { StorageModule } from './modules/storage/storage.module';

// Phase 3.4 Modules
import { DocumentsModule } from './modules/documents/documents.module';
import { BlogModule } from './modules/blog/blog.module';

// Phase 4.2 - Banner Module (removed — content handled by CMS in Phase B)
// import { BannerModule } from './modules/banners/banner.module';

// Phase B - Content (CMS) Module
import { ContentModule } from './modules/content/content.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Throttling (Rate Limiting)
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'rfq',
        ttl: 60000, // 1 minute
        limit: 10, // 10 RFQ submissions per minute
      },
    ]),

    // Prisma - Global module
    PrismaModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    HealthModule,
    ProductModule,
    CategoryModule,
    ApplicationModule,

    // Phase 3.3 - Inquiry/RFQ System
    InquiriesModule,
    CustomerModule,
    CompanyModule,
    EmailModule,
    StorageModule,

    // Phase 3.4 - Document & Blog System
    DocumentsModule,
    BlogModule,

    // Phase 4.2 - Banner System (removed — content via CMS)
    // BannerModule,

    // Phase B - Content (CMS) System
    ContentModule,
  ],
  providers: [
    // Global Throttler Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
