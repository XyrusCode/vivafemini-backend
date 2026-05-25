import { IsDateString } from 'class-validator';

export class CreateCycleDto {
  @IsDateString()
  cycleStartDate!: string;

  @IsDateString()
  periodStartDate!: string;
}
