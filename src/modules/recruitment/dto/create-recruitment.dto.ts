import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateRecruitmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  employmentType: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  experience: string;

  @IsNotEmpty()
  @IsString()
  salaryRange: string;

  @IsNotEmpty()
  @IsString()
  keyResponsibilities: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsString()
  companyValues?: string;

  @IsOptional()
  @IsDateString()
  deadline?: Date;
}
