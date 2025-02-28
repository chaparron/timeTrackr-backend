import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EventDateDto } from './event-date.dto';

export class EventCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  colleagues: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDateDto)
  dates: EventDateDto[];

  @IsString()
  @IsOptional()
  description?: string;
}