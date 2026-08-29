import { Module } from '@nestjs/common';
import { LocalStorageService } from './services/local-storage.service';
import { CloudinaryStorageService } from './services/cloudinary-storage.service';
import { BannerFileValidationService } from './services/banner-file-validation.service';
import { MediaController } from './controllers/media.controller';

@Module({
  controllers: [MediaController],
  providers: [
    LocalStorageService,
    CloudinaryStorageService,
    BannerFileValidationService,
  ],
  exports: [
    LocalStorageService,
    CloudinaryStorageService,
    BannerFileValidationService,
  ],
})
export class StorageModule {}
