import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { JwtGuard } from '@/auth/guards/jwt.guard';

import { AnalyticsService } from './analytics.service';

interface AuthRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('symptom-frequency')
  symptomFrequency(@Req() req: AuthRequest) {
    return this.analyticsService.symptomFrequency(req.user.id);
  }

  @Get('cycle-trends')
  cycleTrends(@Req() req: AuthRequest) {
    return this.analyticsService.cycleTrends(req.user.id);
  }

  @Get('history')
  history(@Req() req: AuthRequest) {
    return this.analyticsService.history(req.user.id);
  }
}
