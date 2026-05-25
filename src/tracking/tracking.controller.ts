import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtGuard } from '@/auth/guards/jwt.guard';

import { CreateTrackingEntryDto } from './dto/create-tracking-entry.dto';
import { UpdateTrackingEntryDto } from './dto/update-tracking-entry.dto';
import { TrackingService } from './tracking.service';

interface AuthRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtGuard)
@Controller('tracking-entries')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get()
  findAll(
    @Req() req: AuthRequest,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.trackingService.findAll(req.user.id, from, to);
  }

  @Get('date/:date')
  findByDate(@Param('date') date: string, @Req() req: AuthRequest) {
    return this.trackingService.findByDate(req.user.id, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.trackingService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateTrackingEntryDto, @Req() req: AuthRequest) {
    return this.trackingService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTrackingEntryDto,
    @Req() req: AuthRequest,
  ) {
    return this.trackingService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.trackingService.remove(id, req.user.id);
  }
}
