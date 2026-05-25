import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async symptomFrequency(userId: string) {
    const entries = await this.prisma.trackingEntry.findMany({
      include: { symptoms: { include: { symptom: true } } },
      where: { userId },
    });

    const counts = new Map<string, { category: string; count: number; name: string }>();
    let total = 0;

    for (const entry of entries) {
      for (const ts of entry.symptoms) {
        const key = ts.symptom.id;
        const existing = counts.get(key);
        if (existing) {
          existing.count++;
        } else {
          counts.set(key, {
            category: ts.symptom.category,
            count: 1,
            name: ts.symptom.name,
          });
        }
        total++;
      }
    }

    return Array.from(counts.values())
      .map((s) => ({
        category: s.category,
        count: s.count,
        percentage: total > 0 ? Math.round((s.count / total) * 100) : 0,
        symptomName: s.name,
      }))
      .sort((a, b) => b.count - a.count);
  }

  async cycleTrends(userId: string) {
    const cycles = await this.prisma.cycle.findMany({
      orderBy: { periodStartDate: 'asc' },
      take: 12,
      where: { userId },
    });

    return cycles.map((c) => ({
      length: c.periodDuration ?? 5,
      month: new Date(c.periodStartDate).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
    }));
  }

  async history(userId: string) {
    const entries = await this.prisma.trackingEntry.findMany({
      include: { symptoms: { include: { symptom: true } } },
      orderBy: { date: 'desc' },
      take: 50,
      where: { userId },
    });

    return entries.map((e) => ({
      date: e.date.toISOString(),
      notes: e.notes,
      topSymptom: e.symptoms[0]?.symptom.name ?? null,
      totalSymptoms: e.symptoms.length,
    }));
  }
}
