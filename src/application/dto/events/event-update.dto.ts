import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EventDateDto } from './event-date.dto';

export class EventUpdateDto {
  @ApiProperty({ description: 'Updated title of the event (optional)', example: 'Updated Team Meeting', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Updated type of the event (optional)', example: 'Workshop', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Updated list of colleagues (optional)', example: ['john@example.com'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  colleagues?: string[];

  @ApiProperty({ description: 'Updated list of event dates (optional)', type: [EventDateDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDateDto)
  @IsOptional()
  dates?: EventDateDto[];

  @ApiProperty({ description: 'Updated description of the event (optional)', example: 'Updated project updates', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}