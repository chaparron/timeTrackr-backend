import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EventDateDto {
  @ApiProperty({ description: 'Start date of the event (ISO format)', example: '2023-12-25T10:00:00Z' })
  @IsString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({ description: 'End date of the event (ISO format, optional)', example: '2023-12-25T12:00:00Z', required: false })
  @IsString()
  @IsOptional()
  end?: string;
}