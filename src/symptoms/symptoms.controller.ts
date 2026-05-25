import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import type { SymptomCategory } from '@prisma/client';

import { JwtGuard } from '@/auth/guards/jwt.guard';

import { SymptomsService } from './symptoms.service';

@UseGuards(JwtGuard)
@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Get()
  findAll(@Query('category') category?: SymptomCategory) {
    return this.symptomsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.symptomsService.findOne(id);
  }
}
