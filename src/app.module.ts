import { Module } from '@nestjs/common';

import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { CyclesModule } from './cycles/cycles.module';
import { HealthReportsModule } from './health-reports/health-reports.module';
import { PrismaModule } from './prisma/prisma.module';
import { SymptomsModule } from './symptoms/symptoms.module';
import { TrackingModule } from './tracking/tracking.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CyclesModule,
    TrackingModule,
    SymptomsModule,
    AnalyticsModule,
    HealthReportsModule,
  ],
})
export class AppModule {}
