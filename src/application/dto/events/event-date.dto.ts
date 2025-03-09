import { IsString, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HourRangeDto {
  @ApiProperty({ example: '10:00', description: 'Start hour in format HH:mm' })
  @IsString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({ example: '12:00', description: 'End hour in format HH:mm', required: false })
  @IsString()
  @IsNotEmpty()
  end?: string;
}

export class EventDateDto {
  @ApiProperty({ example: '2023-12-25', description: 'Day in format YYYY-MM-DD' })
  @IsString()
  @IsNotEmpty()
  day: string;

  @ApiProperty({ type: [HourRangeDto], description: 'hours intervals' })
  @ValidateNested({ each: true })
  @Type(() => HourRangeDto)
  @IsArray()
  hours: HourRangeDto[];
}