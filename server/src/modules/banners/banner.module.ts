import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BannerController } from './controllers';
import { BannerService } from './services';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
