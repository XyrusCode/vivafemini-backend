import { Injectable } from '@nestjs/common';
import type { SymptomCategory } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SymptomsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(category?: SymptomCategory) {
    return this.prisma.symptom.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
    });
  }

  findOne(id: string) {
    return this.prisma.symptom.findUniqueOrThrow({ where: { id } });
  }
}
