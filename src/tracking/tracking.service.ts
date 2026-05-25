import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import type { CreateTrackingEntryDto } from './dto/create-tracking-entry.dto';
import type { UpdateTrackingEntryDto } from './dto/update-tracking-entry.dto';

const SYMPTOM_INCLUDE = {
  symptoms: {
    include: { symptom: true },
  },
};

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string, from?: string, to?: string) {
    return this.prisma.trackingEntry.findMany({
      include: SYMPTOM_INCLUDE,
      orderBy: { date: 'desc' },
      where: {
        userId,
        ...(from || to
          ? {
              date: {
                ...(from && { gte: new Date(from) }),
                ...(to && { lte: new Date(to) }),
              },
            }
          : {}),
      },
    });
  }

  findByDate(userId: string, date: string) {
    const day = new Date(date);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    return this.prisma.trackingEntry.findMany({
      include: SYMPTOM_INCLUDE,
      where: { date: { gte: day, lt: next }, userId },
    });
  }

  async findOne(id: string, userId: string) {
    const entry = await this.prisma.trackingEntry.findFirst({
      include: SYMPTOM_INCLUDE,
      where: { id, userId },
    });
    if (!entry) throw new NotFoundException('Tracking entry not found');
    return entry;
  }

  async create(userId: string, dto: CreateTrackingEntryDto) {
    return this.prisma.trackingEntry.create({
      data: {
        cycleId: dto.cycleId,
        date: new Date(dto.date),
        flowIntensity: dto.flowIntensity,
        notes: dto.notes,
        symptoms: {
          create: dto.symptomIds.map((symptomId) => ({ symptomId })),
        },
        time: dto.time ?? '00:00',
        userId,
      },
      include: SYMPTOM_INCLUDE,
    });
  }

  async update(id: string, userId: string, dto: UpdateTrackingEntryDto) {
    await this.findOne(id, userId);
    const { symptomIds, ...rest } = dto;
    return this.prisma.trackingEntry.update({
      data: {
        ...rest,
        ...(symptomIds && {
          symptoms: {
            deleteMany: {},
            create: symptomIds.map((symptomId) => ({ symptomId })),
          },
        }),
      },
      include: SYMPTOM_INCLUDE,
      where: { id },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.trackingEntry.delete({ where: { id } });
  }
}
