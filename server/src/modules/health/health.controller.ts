import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('健康检查')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  async check() {
    const health = await this.healthService.check();
    return {
      status: health.status,
      timestamp: new Date().toISOString(),
      database: health.database,
      uptime: process.uptime(),
    };
  }
}
