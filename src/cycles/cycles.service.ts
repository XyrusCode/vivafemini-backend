import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import type { CreateCycleDto } from './dto/create-cycle.dto';
import type { UpdateCycleDto } from './dto/update-cycle.dto';

const AVG_CYCLE_LENGTH = 28;
const AVG_OVULATION_OFFSET = 14;

@Injectable()
export class CyclesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.cycle.findMany({
      orderBy: { cycleStartDate: 'desc' },
      where: { userId },
    });
  }

  async findCurrent(userId: string) {
    return this.prisma.cycle.findFirst({
      orderBy: { cycleStartDate: 'desc' },
      where: { status: 'active', userId },
    });
  }

  async findOne(id: string, userId: string) {
    const cycle = await this.prisma.cycle.findFirst({
      where: { id, userId },
    });
    if (!cycle) throw new NotFoundException('Cycle not found');
    return cycle;
  }

  async predictions(id: string, userId: string) {
    const cycle = await this.findOne(id, userId);

    // Use actual cycle history to compute average
    const past = await this.prisma.cycle.findMany({
      orderBy: { cycleStartDate: 'desc' },
      take: 6,
      where: { status: 'completed', userId },
    });

    const avgLength =
      past.length > 0
        ? Math.round(
            past.reduce((s, c) => s + c.cycleLength, 0) / past.length,
          )
        : AVG_CYCLE_LENGTH;

    const startDate = new Date(cycle.periodStartDate);
    const ovulationStart = new Date(startDate);
    ovulationStart.setDate(
      ovulationStart.getDate() + avgLength - AVG_OVULATION_OFFSET - 2,
    );
    const ovulationEnd = new Date(ovulationStart);
    ovulationEnd.setDate(ovulationEnd.getDate() + 5);
    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(nextPeriod.getDate() + avgLength);

    return {
      averageCycleLength: avgLength,
      estimatedNextPeriod: nextPeriod.toISOString().split('T')[0],
      ovulationEnd: ovulationEnd.toISOString().split('T')[0],
      ovulationStart: ovulationStart.toISOString().split('T')[0],
    };
  }

  create(userId: string, dto: CreateCycleDto) {
    return this.prisma.cycle.create({
      data: {
        cycleStartDate: new Date(dto.cycleStartDate),
        periodStartDate: new Date(dto.periodStartDate),
        userId,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateCycleDto) {
    await this.findOne(id, userId);
    return this.prisma.cycle.update({
      data: {
        ...(dto.cycleEndDate && { cycleEndDate: new Date(dto.cycleEndDate) }),
        ...(dto.periodEndDate && { periodEndDate: new Date(dto.periodEndDate) }),
        ...(dto.periodDuration && { periodDuration: dto.periodDuration }),
      },
      where: { id },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.cycle.delete({ where: { id } });
  }
}
