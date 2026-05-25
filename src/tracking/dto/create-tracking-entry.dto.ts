import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTrackingEntryDto {
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  cycleId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  flowIntensity?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @IsString({ each: true })
  symptomIds!: string[];
}
