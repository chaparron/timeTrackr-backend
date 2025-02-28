import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventDateDto } from './event-date.dto';

export class EventUpdateDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  colleagues?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDateDto)
  @IsOptional()
  dates?: EventDateDto[];

  @IsString()
  @IsOptional()
  description?: string;
}