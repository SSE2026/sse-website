import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BannerController } from './controllers';
import { BannerService } from './services';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    StorageModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
