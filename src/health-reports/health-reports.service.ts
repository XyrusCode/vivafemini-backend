import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class HealthReportsService {
  constructor(private readonly prisma: PrismaService) {}

  findLatest(userId: string) {
    return this.prisma.healthReport.findFirst({
      orderBy: { generatedAt: 'desc' },
      where: { userId },
    });
  }

  findMonthly(userId: string, year: number, month: number) {
    const monthYear = new Date(year, month - 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    return this.prisma.healthReport.findFirst({
      where: { monthYear, userId },
    });
  }

  async findOne(id: string, userId: string) {
    const report = await this.prisma.healthReport.findFirst({
      where: { id, userId },
    });
    if (!report) throw new NotFoundException('Health report not found');
    return report;
  }

  async generate(userId: string) {
    // Gather data for the current month
    const now = new Date();
    const monthYear = now.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    const cycles = await this.prisma.cycle.findMany({
      orderBy: { cycleStartDate: 'desc' },
      take: 6,
      where: { userId },
    });

    const avgCycleLength =
      cycles.length > 0
        ? Math.round(
            cycles.reduce((s, c) => s + c.cycleLength, 0) / cycles.length,
          )
        : 28;

    const entries = await this.prisma.trackingEntry.findMany({
      include: { symptoms: { include: { symptom: true } } },
      where: { userId },
    });

    const symptomCounts = new Map<string, number>();
    const categoryCounts: Record<string, number> = {};

    for (const entry of entries) {
      for (const ts of entry.symptoms) {
        const name = ts.symptom.name;
        symptomCounts.set(name, (symptomCounts.get(name) ?? 0) + 1);
        categoryCounts[ts.symptom.category] =
          (categoryCounts[ts.symptom.category] ?? 0) + 1;
      }
    }

    const mostFrequentSymptom = symptomCounts.size > 0
      ? [...symptomCounts.entries()].sort((a, b) => b[1] - a[1])[0]![0]
      : null;

    const activeCycle = cycles[0];
    if (!activeCycle) throw new NotFoundException('No cycles found to generate report');

    return this.prisma.healthReport.create({
      data: {
        averageCycleLength: avgCycleLength,
        cycleId: activeCycle.id,
        monthYear,
        mostFrequentSymptom,
        pmsSymptomFrequency: JSON.stringify(Object.fromEntries(symptomCounts)),
        symptomFrequencyBreakdown: JSON.stringify(categoryCounts),
        userId,
      },
    });
  }
}
