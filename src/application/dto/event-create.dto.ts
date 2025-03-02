import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EventDateDto } from './event-date.dto';

export class EventCreateDto {
  @ApiProperty({ description: 'Title of the event', example: 'Team Meeting' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Type of the event', example: 'Meeting' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'List of colleagues (optional)', example: ['john@example.com', 'jane@example.com'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colleagues?: string[];

  @ApiProperty({ description: 'List of event dates (optional)', type: [EventDateDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => EventDateDto)
  dates?: EventDateDto[];

  @ApiProperty({ description: 'Description of the event (optional)', example: 'Discuss project updates', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}