import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';

@Module({
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
