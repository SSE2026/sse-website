import { Module } from '@nestjs/common';
import { EmailService, EMAIL_SERVICE } from './interfaces/email-service.interface';
import { MockEmailService } from './services/mock-email.service';

@Module({
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: MockEmailService, // Default to mock for development
    },
  ],
  exports: [EMAIL_SERVICE],
})
export class EmailModule {}

// Export EmailService type for convenience
export { EmailService };
