import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DocumentsController, AdminDocumentsController } from './controllers';
import { DocumentService, DocumentDownloadService } from './services';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    StorageModule,
  ],
  controllers: [DocumentsController, AdminDocumentsController],
  providers: [DocumentService, DocumentDownloadService],
  exports: [DocumentService, DocumentDownloadService],
})
export class DocumentsModule {}
