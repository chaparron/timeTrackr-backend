import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class EventDateDto {
  @IsString()
  start: string;

  @IsOptional()
  @IsString()
  end?: string;
}

export class EventCreateDto {
  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colleagues?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => EventDateDto)
  dates?: EventDateDto[];

  @IsOptional()
  @IsString()
  description?: string;
}