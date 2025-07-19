import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateRecruitmentDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsString()
  requirements?: string;

  @IsString()
  benefits?: string;

  @IsDateString()
  deadline?: Date;
}