import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { JwtGuard } from '@/auth/guards/jwt.guard';

import { HealthReportsService } from './health-reports.service';

interface AuthRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtGuard)
@Controller('health-reports')
export class HealthReportsController {
  constructor(private readonly healthReportsService: HealthReportsService) {}

  @Get('latest')
  findLatest(@Req() req: AuthRequest) {
    return this.healthReportsService.findLatest(req.user.id);
  }

  @Get('monthly/:year/:month')
  findMonthly(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Req() req: AuthRequest,
  ) {
    return this.healthReportsService.findMonthly(req.user.id, year, month);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.healthReportsService.findOne(id, req.user.id);
  }

  @Post('generate')
  generate(@Req() req: AuthRequest) {
    return this.healthReportsService.generate(req.user.id);
  }
}
