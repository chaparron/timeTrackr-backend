import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class EventDateDto {
  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsOptional()
  end?: string;
}