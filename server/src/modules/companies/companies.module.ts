import { Module } from '@nestjs/common';
import { CompanyService } from './services/company.service';

@Module({
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
