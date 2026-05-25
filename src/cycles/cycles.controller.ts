import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtGuard } from '@/auth/guards/jwt.guard';

import { CyclesService } from './cycles.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';

interface AuthRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtGuard)
@Controller('cycles')
export class CyclesController {
  constructor(private readonly cyclesService: CyclesService) {}

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.cyclesService.findAll(req.user.id);
  }

  @Get('current')
  findCurrent(@Req() req: AuthRequest) {
    return this.cyclesService.findCurrent(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.cyclesService.findOne(id, req.user.id);
  }

  @Get(':id/predictions')
  predictions(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.cyclesService.predictions(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateCycleDto, @Req() req: AuthRequest) {
    return this.cyclesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCycleDto,
    @Req() req: AuthRequest,
  ) {
    return this.cyclesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.cyclesService.remove(id, req.user.id);
  }
}
