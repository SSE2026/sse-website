import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { InquiriesController } from './controllers/inquiries.controller';
import { AdminInquiriesController } from './controllers/admin-inquiries.controller';
import { InquiryService } from './services/inquiry.service';
import { InquiryNumberService } from './services/inquiry-number.service';
import { SnapshotService } from './services/snapshot.service';
import { LeadActivityService } from './services/lead-activity.service';
import { CustomerModule } from '../customers/customers.module';
import { StorageModule } from '../storage/storage.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CustomerModule,
    StorageModule,
    EmailModule,
  ],
  controllers: [InquiriesController, AdminInquiriesController],
  providers: [
    InquiryService,
    InquiryNumberService,
    SnapshotService,
    LeadActivityService,
  ],
  exports: [InquiryService],
})
export class InquiriesModule {}
