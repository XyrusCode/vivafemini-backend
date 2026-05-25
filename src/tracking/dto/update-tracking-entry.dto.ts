import { IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateTrackingEntryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  flowIntensity?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptomIds?: string[];
}
