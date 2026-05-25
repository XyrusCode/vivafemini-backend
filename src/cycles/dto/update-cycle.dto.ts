import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateCycleDto {
  @IsOptional()
  @IsDateString()
  cycleEndDate?: string;

  @IsOptional()
  @IsDateString()
  periodEndDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(14)
  periodDuration?: number;
}
