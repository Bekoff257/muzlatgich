import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { StatsService } from './stats.service';

@ApiTags('stats')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Get('summary')
  summary() { return this.service.summary(); }
}
